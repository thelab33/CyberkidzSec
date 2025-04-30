# src/blueprints/ai_assistant/routes.py
from flask import Blueprint, render_template

bp = Blueprint(
    "ai_assistant",
    __name__,
    template_folder="../../templates/ai_assistant",
    static_folder="../../static/ai_assistant",
)

@bp.route("/", methods=["GET"])
def index():
    return render_template(
        "ai_assistant/index.html",
        title="ai /assistant Home"
    )
