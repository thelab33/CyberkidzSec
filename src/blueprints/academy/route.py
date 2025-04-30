# src/blueprints/academy/routes.py
from flask import Blueprint, render_template, jsonify
import json

academy = Blueprint('academy', __name__, url_prefix='/academy')

@academy.route("/")
def academy_home():
    with open("missions.json") as f:
        missions = json.load(f)
    return render_template("academy/index.html", missions=missions)

