@views.route("/")
def home():
    xp = calculate_vault_xp()
    level = calculate_operative_level(xp)

    hero = {
        'heading': "CYBERKIDZSEC VAULT",
        'subheading': "“Ghosted but not gone.”",
        'typer_phrases': [
            "🔐 Zero-Day Archive Updating…",
            "💀 CYBERKIDZSEC VAULT",
            "“Ghosted but not gone.”"
        ],
        'stats': [
            {'icon': '🛰️', 'label': 'Operative Title', 'value': get_operative_title(xp)},
            {'icon': '⬆️', 'label': 'Level', 'value': level},
            {'icon': '🛡️', 'label': 'Vault Stability', 'value': f"{xp}%"}
        ],
        'ctas': [
            {'type': 'button', 'id': 'searchBtn', 'label': '⌘ Cmd + K — Search', 'classes': 'btn--outline'},
            {'type': 'link', 'href': '#playground', 'label': '🎮 Hack the Vault', 'classes': 'btn--solid'}
        ]
    }

    context = {
        'title': "Home — CyberKidzSec Vault",
        'vault_xp_percentage': xp,
        'operative_level': level,
        'operative_title': get_operative_title(xp),
        'status_message': determine_status_message(xp),
        'hero': hero,  # ✅ THIS is the missing key
        'featured_reports': [
            {
                'slug': f"demo-{i}",
                'title': f"Demo Report {i}",
                'summary': "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                'tags': ["xss", "race", "web3", "injection"][:((i - 1) % 4) + 1]
            }
            for i in range(1, 10)
        ],
    }

    return render_template("index.html", **context)

