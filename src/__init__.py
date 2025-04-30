# src/__init__.py
# ───────────────────────────────────────────────────────────────────────── #
#  CYBERKIDZSEC VAULT — Flask App Init (Blueprints, Extensions, etc.)
# ───────────────────────────────────────────────────────────────────────── #
# src/__init__.py
from .blueprints.api import api
from .blueprints.views import views

from flask import Flask
from .extensions import cache

def create_app():
    app = Flask(__name__)

    # App config
    app.config["CACHE_TYPE"] = "SimpleCache"
    app.config["CACHE_DEFAULT_TIMEOUT"] = 300

    # Initialize extensions
    cache.init_app(app)

    # Register blueprints
    from src.api import api
    from src.views import views

    app.register_blueprint(api)
    app.register_blueprint(views)

    # Error handlers
    register_error_pages(app)

    return app

def register_error_pages(app):
    from flask import render_template

    @app.errorhandler(404)
    def page_not_found(e):
        return render_template("errors/404.html", title="404 — Not Found"), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template("errors/500.html", title="500 — Server Error"), 500

