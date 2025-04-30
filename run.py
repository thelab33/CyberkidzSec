# run.py
# ───────────────────────────────────────────────────────────────────────── #
#  CYBERKIDZSEC ⚡ VAULT — Development Launcher
# ───────────────────────────────────────────────────────────────────────── #

# run.py

from src.app import create_app

# this top-level `app` is what Flask CLI will import
app = create_app()

if __name__ == "__main__":
    # fallback if you still like `python run.py`
    app.run(debug=True)

