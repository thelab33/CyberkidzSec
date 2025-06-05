# src/app.py
#
#  CYBERKIDZSEC VAULT · Flask Application Entry
#  Modular App Factory | Blueprint Architecture | Extensions Init
#

import os
from pathlib import Path
from datetime import datetime
from flask import Flask, render_template, url_for

# -- Extensions --
from src.extensions import cache, db, migrate

# -- Core Blueprints --
from src.blueprints.views import views
from src.blueprints.api import api
from src.blueprints.academy.routes import academy
from src.blueprints.dashboard.routes import dashboard
from src.blueprints.playground.routes import playground

# -- Feature Blueprints --
from src.blueprints.bug_vault.routes import bp as bug_vault_bp
from src.blueprints.threat_labs.routes import bp as threat_labs_bp
from src.blueprints.vault_dashboard.routes import bp as vault_dashboard_bp
from src.blueprints.pentest_playground.routes import bp as pentest_playground_bp
from src.blueprints.vuln_scanner.routes import bp as vuln_scanner_bp
from src.blueprints.api_playground.routes import bp as api_playground_bp
from src.blueprints.smart_contract_playground.routes import bp as sc_playground_bp
from src.blueprints.ai_assistant.routes import bp as ai_assistant_bp
from src.blueprints.status.routes import status
from src.blueprints.copilot import copilot

# -- Paths --
BASE_DIR = Path(__file__).resolve().parent
TEMPLATES_DIR = BASE_DIR.parent / "templates"
STATIC_DIR = BASE_DIR.parent / "static"


def static_url(filename: str) -> str:
    """Versioned static file URL for cache-busting."""
    filepath = STATIC_DIR / filename
    version = int(filepath.stat().st_mtime) if filepath.exists() else 0
    return url_for("static", filename=filename, v=version)


import sentry_sdk
def create_app() -> Flask:
    """Create and configure the CYBERKIDZSEC Flask application."""
    # Sentry backend init
    sentry_sdk.init(dsn=os.getenv('SENTRY_DSN', ''), traces_sample_rate=0.4, release=os.getenv('RELEASE', 'dev'))
    app = Flask(
        __name__,
        template_folder=str(TEMPLATES_DIR),
        static_folder=str(STATIC_DIR),
    )

    # Configuration
    app.config.update({
        "SQLALCHEMY_DATABASE_URI": os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'data.db'}"),
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
    })

    # Initialize extensions
    cache.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)

    from flask_compress import Compress
    Compress(app)

    # Import models for Alembic migrations
    with app.app_context():
        import src.models  # noqa: F401

    # Global Jinja helpers
    app.jinja_env.globals["now"] = datetime.utcnow
    app.jinja_env.globals["static_url"] = static_url

    # Inject discovered assets (CSS/JS)
    @app.context_processor
    def inject_static_asset_lists():
        static_root = app.static_folder
        css_files, js_files = [], []

        css_dir = os.path.join(static_root, "css")
        for dirpath, dirnames, filenames in os.walk(css_dir):
            dirnames[:] = [d for d in dirnames if not (d == "cleaned" or d.startswith('.'))]
            rel_dir = os.path.relpath(dirpath, static_root).replace("\\", "/")
            css_files += [f"{rel_dir}/{fn}" for fn in filenames if fn.lower().endswith(".css")]

        js_dir = os.path.join(static_root, "js")
        for dirpath, dirnames, filenames in os.walk(js_dir):
            dirnames[:] = [d for d in dirnames if not d.startswith('.')]
            rel_dir = os.path.relpath(dirpath, static_root).replace("\\", "/")
            js_files += [f"{rel_dir}/{fn}" for fn in filenames if fn.lower().endswith(".js")]

        return dict(css_files=sorted(css_files), js_files=sorted(js_files))

    register_blueprints(app)
    register_error_pages(app)
    return app


def register_blueprints(app: Flask) -> None:
    """Attach all blueprints to the app."""
    # Core
    app.register_blueprint(views)
    app.register_blueprint(api)
    app.register_blueprint(academy)
    app.register_blueprint(dashboard)
    app.register_blueprint(playground)
    # Feature
    app.register_blueprint(bug_vault_bp, url_prefix='/vault')
    app.register_blueprint(threat_labs_bp, url_prefix='/labs')
    app.register_blueprint(vault_dashboard_bp, url_prefix='/dashboard')
    app.register_blueprint(pentest_playground_bp, url_prefix='/playground')
    app.register_blueprint(vuln_scanner_bp, url_prefix='/scanner')
    app.register_blueprint(api_playground_bp, url_prefix='/api')
    app.register_blueprint(sc_playground_bp, url_prefix='/contracts')
    app.register_blueprint(ai_assistant_bp, url_prefix='/assistant')
    app.register_blueprint(status)
    app.register_blueprint(copilot)


def register_error_pages(app: Flask) -> None:
    """Custom error handlers for 404 and 500."""
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template("errors/404.html", title="404 Not Found"), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template("errors/500.html", title="500 Server Error"), 500
