# src/blueprints/playground/routes.py
from flask import Blueprint, render_template

playground = Blueprint("playground", __name__, url_prefix="/playground")

@playground.route("/")
def playground_home():
    return render_template("playground/index.html", title="Ghost Playground 🧙‍♂️")

