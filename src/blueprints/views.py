# src/blueprints/views.py

from flask import Blueprint, render_template

views = Blueprint("views", __name__)

# ─── Homepage ─────────────────────────────────────────────────
@views.route("/")
def home():
    vault_xp_percentage = calculate_vault_xp()
    operative_title = get_operative_title(vault_xp_percentage)
    operative_level = determine_operative_level(vault_xp_percentage)
    status_message = determine_status_message(vault_xp_percentage)

    return render_template(
        "index.html",
        title="Home — CyberKidzSec Vault",
        vault_xp_percentage=vault_xp_percentage,
        operative_title=operative_title,
        operative_level=operative_level,
        status_message=status_message,
    )

# ─── About Page ───────────────────────────────────────────────
@views.route("/about")
def about():
    return render_template("about.html", title="About — CyberKidzSec Vault")

# ─── Reports Listing ──────────────────────────────────────────
@views.route("/reports")
def reports_list():
    return render_template("reports_list.html", title="Reports — CyberKidzSec Vault")

# ─── Playground ───────────────────────────────────────────────
@views.route("/playground")
def playground():
    return render_template("playground.html", title="Playground — CyberKidzSec Vault")


# ─── Helper Functions (XP + Status Logic) ─────────────────────
def calculate_vault_xp():
    # Later this will be dynamic based on actual posted reports
    return 45  # Example: 45% XP

def get_operative_title(xp: int) -> str:
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

def determine_operative_level(xp: int) -> int:
    return int(xp / 10) + 1

def determine_status_message(xp: int) -> str:
    if xp < 30:
        return "Stabilizing Systems"
    elif xp < 70:
        return "Vault Ascending"
    else:
        return "PRIME ACTIVE"

