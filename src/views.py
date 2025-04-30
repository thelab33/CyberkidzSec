# src/blueprints/views.py
# ───────────────────────────────────────────────────────────────────────── #
from flask import Blueprint, render_template

views = Blueprint("views", __name__)

# ─── Helper functions ───────────────────────────────────────────────────── #
def calculate_vault_xp():
    # Later: make this dynamic based on actual report count / contributions
    return 45  # Example starting XP

def calculate_operative_level(xp):
    # Example simple level system: 10 XP = 1 Level
    return int(xp / 10) + 1

def get_operative_title(xp):
    if xp < 25:
        return "🕵️ Ghost Initiate"
    elif xp < 50:
        return "🧠 Codebreaker"
    elif xp < 75:
        return "🔥 Vault Hacker"
    elif xp < 100:
        return "🛰️ Prime Operative"
    else:
        return "👑 Grandmaster Ghost"

def determine_status_message(xp):
    if xp < 30:
        return "Stabilizing Systems"
    elif xp < 70:
        return "Vault Ascending"
    else:
        return "PRIME ACTIVE"

# ─── Homepage ───────────────────────────────────────────────────────────── #
@views.route("/")
def home():
    vault_xp_percentage = calculate_vault_xp()
    operative_level = calculate_operative_level(vault_xp_percentage)
    operative_title = get_operative_title(vault_xp_percentage)
    status_message = determine_status_message(vault_xp_percentage)

    return render_template(
        "index.html",
        title="Home — CyberKidzSec Vault",
        vault_xp_percentage=vault_xp_percentage,
        operative_level=operative_level,
        operative_title=operative_title,
        status_message=status_message,
    )

# ─── About ───────────────────────────────────────────────────────────────── #
@views.route("/about")
def about():
    return render_template("about.html", title="About — CyberKidzSec Vault")

# ─── Blog ────────────────────────────────────────────────────────────────── #
@views.route("/blog")
def blog():
    return render_template("blog.html", title="Blog — CyberKidzSec Vault")

# ─── Playground (Hack Me) ────────────────────────────────────────────────── #
@views.route("/playground")
def playground():
    return render_template("playground.html", title="Hacker Playground — CyberKidzSec")

# ─── Reports List ────────────────────────────────────────────────────────── #
@views.route("/reports")
def reports_list():
    return render_template("reports_list.html", title="Vault Reports — CyberKidzSec")

# ─── Individual Report Detail ────────────────────────────────────────────── #
@views.route("/reports/<slug>")
def report_detail(slug):
    return render_template("report_detail.html", slug=slug, title=f"Vault Report — {slug}")

# ─── Charts/Analytics ────────────────────────────────────────────────────── #
@views.route("/charts")
def charts():
    return render_template("charts.html", title="Vault Analytics — CyberKidzSec")

