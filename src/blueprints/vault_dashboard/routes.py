# src/blueprints/vault_dashboard/routes.py
from flask import Blueprint, render_template

bp = Blueprint(
    "vault_dashboard",
    __name__,
    template_folder="../../templates/vault_dashboard",
    static_folder="../../static/vault_dashboard",
)

@bp.route("/", methods=["GET"])
def index():
    return render_template(
        "vault_dashboard/index.html",
        title="vault /dashboard Home"
    )
