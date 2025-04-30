# src/blueprints/bug_vault/routes.py
from flask import Blueprint, render_template

bp = Blueprint(
    "bug_vault",
    __name__,
    template_folder="../../templates/bug_vault",
    static_folder="../../static/bug_vault",
)

@bp.route("/", methods=["GET"])
def index():
    return render_template(
        "bug_vault/index.html",
        title="bug /vault Home"
    )
