# src/blueprints/threat_labs/routes.py
from flask import Blueprint, render_template

bp = Blueprint(
    "threat_labs",
    __name__,
    template_folder="../../templates/threat_labs",
    static_folder="../../static/threat_labs",
)

@bp.route("/", methods=["GET"])
def index():
    return render_template(
        "threat_labs/index.html",
        title="threat /labs Home"
    )
