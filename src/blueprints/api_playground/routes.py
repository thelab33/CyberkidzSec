# src/blueprints/api_playground/routes.py
from flask import Blueprint, render_template

bp = Blueprint(
    "api_playground",
    __name__,
    template_folder="../../templates/api_playground",
    static_folder="../../static/api_playground",
)

@bp.route("/", methods=["GET"])
def index():
    return render_template(
        "api_playground/index.html",
        title="api /playground Home"
    )
