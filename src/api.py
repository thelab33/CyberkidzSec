# src/api.py
# ───────────────────────────────────────────────────────────────────────── #
#  CYBERKIDZSEC Vault - API Blueprint
# ───────────────────────────────────────────────────────────────────────── #

from flask import Blueprint, jsonify

api = Blueprint("api", __name__, url_prefix="/api")

# Example route: latest CVEs (or your radar blips later)
@api.route("/ping")
def ping():
    return jsonify({"message": "pong"})

