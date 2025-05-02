from flask import Blueprint, render_template

views = Blueprint("views", __name__)

# ─── Homepage ─────────────────────────────────────────────────
@views.route("/")
def home():
    vault_xp_percentage = calculate_vault_xp()
    operative_title = get_operative_title(vault_xp_percentage)
    operative_level = determine_operative_level(vault_xp_percentage)
    status_message = determine_status_message(vault_xp_percentage)

    hero = {
        'heading': "CYBERKIDZSEC VAULT",
        'subheading': "“Ghosted but not gone.”",
        'typer_phrases': [
            "🔐 Zero-Day Archive Updating…",
            "💀 CYBERKIDZSEC VAULT",
            "“Ghosted but not gone.”"
        ],
        'stats': [
            {'icon': '🛰️', 'label': 'Operative Title', 'value': operative_title},
            {'icon': '⬆️', 'label': 'Level', 'value': operative_level},
            {'icon': '🛡️', 'label': 'Vault Stability', 'value': f"{vault_xp_percentage}%"}
        ],
        'ctas': [
            {'type': 'button', 'id': 'searchBtn', 'label': '⌘ Cmd + K — Search', 'classes': 'btn--outline'},
            {'type': 'link', 'href': '#playground', 'label': '🎮 Hack the Vault', 'classes': 'btn--solid'}
        ]
    }

    return render_template(
        "index.html",
        title="Home — CyberKidzSec Vault",
        vault_xp_percentage=vault_xp_percentage,
        operative_title=operative_title,
        operative_level=operative_level,
        status_message=status_message,
        hero=hero,  # ✅ Add this to fix the template error
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

# ─── Report Detail ────────────────────────────────────────────
@views.route("/reports/<slug>")
def report_detail(slug: str):
    return render_template("report_detail.html", slug=slug, title=f"Vault Report — {slug}")

# ─── Charts / Analytics ───────────────────────────────────────
@views.route("/charts")
def charts():
    return render_template("charts.html", title="Vault Analytics — CyberKidzSec Vault")

# ─── Helper Functions (XP + Status Logic) ─────────────────────
def calculate_vault_xp():
    return 45  # Example XP

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

