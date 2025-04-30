# src/blueprints/smart_contract_playground/routes.py
from flask import Blueprint, render_template

bp = Blueprint(
    "smart_contract_playground",
    __name__,
    template_folder="../../templates/smart_contract_playground",
    static_folder="../../static/smart_contract_playground",
)

@bp.route("/", methods=["GET"])
def index():
    return render_template(
        "smart_contract_playground/index.html",
        title="smart /contract /playground Home"
    )
