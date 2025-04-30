from flask import Blueprint, render_template

academy = Blueprint("academy", __name__, url_prefix="/academy")

@academy.route("/")
def academy_home():
    return render_template("academy/index.html", title="Ghost Academy · CyberKidzSec Vault")

