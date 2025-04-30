# src/blueprints/vuln_scanner/routes.py
from flask import Blueprint, render_template

bp = Blueprint(
    "vuln_scanner",
    __name__,
    template_folder="../../templates/vuln_scanner",
    static_folder="../../static/vuln_scanner",
)

@bp.route("/", methods=["GET"])
def index():
    return render_template(
        "vuln_scanner/index.html",
        title="vuln /scanner Home"
    )
