# src/app.py
# ─────────────────────────────────────────────────────────────────────────────
#  CYBERKIDZSEC ⚡ VAULT — Flask Application Entry
#  Modular Blueprint Setup + DB & Migrations
# ─────────────────────────────────────────────────────────────────────────────

import os
from pathlib import Path
from datetime import datetime

from flask import Flask, render_template

from src.extensions import cache, db, migrate

# ─── Core Blueprints ──────────────────────────────────────────────────────────
from src.blueprints.views import views
from src.blueprints.api import api
from src.blueprints.academy.routes import academy
from src.blueprints.dashboard.routes import dashboard
from src.blueprints.playground.routes import playground

# ─── New Vault Feature Blueprints ─────────────────────────────────────────────
from src.blueprints.bug_vault.routes import bp as bug_vault_bp
from src.blueprints.threat_labs.routes import bp as threat_labs_bp
from src.blueprints.vault_dashboard.routes import bp as vault_dashboard_bp
from src.blueprints.pentest_playground.routes import bp as pentest_playground_bp
from src.blueprints.vuln_scanner.routes import bp as vuln_scanner_bp
from src.blueprints.api_playground.routes import bp as api_playground_bp
from src.blueprints.smart_contract_playground.routes import bp as sc_playground_bp
from src.blueprints.ai_assistant.routes import bp as ai_assistant_bp

# ─── Paths ───────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
TEMPLATES_DIR = BASE_DIR.parent / "templates"
STATIC_DIR = BASE_DIR.parent / "static"

# ─── App Factory ─────────────────────────────────────────────────────────────
def create_app():
    """Create and configure the Flask app."""
    app = Flask(
        __name__,
        template_folder=str(TEMPLATES_DIR),
        static_folder=str(STATIC_DIR),
    )

    # Configuration
    app.config.update({
        "SQLALCHEMY_DATABASE_URI": os.getenv(
            "DATABASE_URL", f"sqlite:///{BASE_DIR / 'data.db'}"
        ),
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
    })

    # Initialize extensions
    cache.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)

    # Ensure models are registered for migrations
    with app.app_context():
        # import all model modules here
        import src.models  # noqa: F401

    # Global Jinja helpers
    app.jinja_env.globals["now"] = datetime.utcnow

    # Register blueprints and error handlers
    register_blueprints(app)
    register_error_pages(app)

    return app

# ─── Blueprint Registration ──────────────────────────────────────────────────
def register_blueprints(app):
    app.register_blueprint(views)
    app.register_blueprint(api)
    app.register_blueprint(academy)
    app.register_blueprint(dashboard)
    app.register_blueprint(playground)

    app.register_blueprint(bug_vault_bp,          url_prefix='/vault')
    app.register_blueprint(threat_labs_bp,        url_prefix='/labs')
    app.register_blueprint(vault_dashboard_bp,    url_prefix='/dashboard')
    app.register_blueprint(pentest_playground_bp, url_prefix='/playground')
    app.register_blueprint(vuln_scanner_bp,       url_prefix='/scanner')
    app.register_blueprint(api_playground_bp,     url_prefix='/api')
    app.register_blueprint(sc_playground_bp,      url_prefix='/contracts')
    app.register_blueprint(ai_assistant_bp,       url_prefix='/assistant')

# ─── Error Pages ─────────────────────────────────────────────────────────────
def register_error_pages(app):
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template("errors/404.html", title="404 — Not Found"), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template("errors/500.html", title="500 — Server Error"), 500

