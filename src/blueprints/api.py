"""
JSON / Worker Endpoints
────────────────────────────────────────────────────────────────────────────
    GET  /api/cve       → 10 items from CIRCL CVE RSS  (edge-cached)
    GET  /api/reports   → Filtered list of static reports
    POST /api/log       → Client telemetry / audit sink
"""

from __future__ import annotations

import datetime as dt
import json
import logging
import time
from pathlib import Path
from typing import Any, Callable, Dict, Tuple

from flask import Blueprint, current_app, jsonify, request

# Optional RSS dependency
try:
    import feedparser  # type: ignore
except ModuleNotFoundError:
    feedparser = None

# ─── Setup ──────────────────────────────────────────────────────
api = Blueprint("api", __name__, url_prefix="/api")
log = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
REPORTS_PATH = BASE_DIR / "static" / "data" / "reports.json"

# ─── In-Process Cache ───────────────────────────────────────────
def cache_for(seconds: int) -> Callable[..., Callable[..., Any]]:
    store: Dict[Tuple[Any, Tuple[Tuple[str, Any], ...]], Tuple[Any, float]] = {}

    def decorator(fn: Callable[..., Any]) -> Callable[..., Any]:
        def wrapped(*args: Any, **kwargs: Any) -> Any:
            key = (args, tuple(sorted(kwargs.items())))
            now = time.time()
            if key in store:
                result, ts = store[key]
                if now - ts < seconds:
                    return result
            result = fn(*args, **kwargs)
            store[key] = (result, now)
            return result
        return wrapped
    return decorator

# ─── Reports Loader ─────────────────────────────────────────────
@cache_for(60)
def _load_reports() -> list[dict[str, Any]]:
    try:
        with REPORTS_PATH.open(encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        log.error("Failed to load reports.json: %s", e)
        return []

# ─── Routes ─────────────────────────────────────────────────────
# /api/cve → CIRCL CVE RSS feed
@api.route("/cve")
@cache_for(60)
def latest_cve():
    if feedparser is None:
        log.warning("feedparser not installed – /api/cve disabled")
        return jsonify({"error": "RSS backend not available"}), 503

    try:
        feed = feedparser.parse("https://cve.circl.lu/feed/rss")
        items = feed.get("entries", [])[:10]
        return jsonify(items)
    except Exception:
        log.exception("CIRCL CVE RSS fetch failed")
        return jsonify({"error": "Failed to fetch RSS"}), 502

# /api/reports → Vulnerability archive
@api.route("/reports")
def reports():
    q = request.args.get("q", "").strip().lower()
    type_filter = request.args.get("type")
    limit = int(request.args.get("limit", 20))

    data = _load_reports()

    if q:
        data = [r for r in data if q in r.get("title", "").lower()]
    if type_filter:
        data = [r for r in data if r.get("type") == type_filter]

    return jsonify(data[:limit])

# /api/log → GhostVault telemetry
@api.route("/log", methods=["POST"])
def log_event():
    try:
        payload: dict[str, Any] | None = request.get_json(force=True)
        if not payload:
            raise ValueError("empty or malformed JSON")
    except Exception:
        return jsonify({
            "success": False,
            "error": "Invalid JSON payload"
        }), 400

    entry = {
        "action": payload.get("action", "unspecified"),
        "ip_address": request.headers.get("X-Forwarded-For", request.remote_addr),
        "request_id": request.headers.get("X-Request-ID"),
        "metadata": payload.get("metadata", {}),
        "timestamp": dt.datetime.utcnow().isoformat(timespec="seconds") + "Z",
    }

    current_app.logger.info("📦 GhostVault Telemetry: %s", entry)
    return jsonify({"success": True, "received": entry}), 200

