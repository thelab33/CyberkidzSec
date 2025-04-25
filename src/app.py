# src/app.py
# ------------------------------------------------------------------------ #
#  FLASK APPLICATION ENTRY
# ------------------------------------------------------------------------ #
from pathlib import Path
from datetime import datetime          #  ← NEW
from flask import Flask, render_template

# ------------------------------------------------------------------------ #
#  Configure paths  (templates/ and static/ live inside this src/ folder)
# ------------------------------------------------------------------------ #
BASE_DIR       = Path(__file__).resolve().parent        # …/src
TEMPLATES_DIR  = BASE_DIR / "templates"                 # …/src/templates
STATIC_DIR     = BASE_DIR / "static"                    # …/src/static

# ------------------------------------------------------------------------ #
#  Create Flask instance
# ------------------------------------------------------------------------ #
app = Flask(
    __name__,
    template_folder=str(TEMPLATES_DIR),
    static_folder=str(STATIC_DIR),
)

# -- make `now()` available inside every Jinja template ------------------ #
app.jinja_env.globals["now"] = datetime.utcnow          # utc-aware helper

# ------------------------------------------------------------------------ #
#  Routes
# ------------------------------------------------------------------------ #
@app.route("/")
def home():
    """Landing page."""
    return render_template("index.html", title="CyberKidzSec Vault")

# additional routes can be declared here
# e.g.  @app.route("/reports")  def reports(): ...

# ------------------------------------------------------------------------ #
#  (Don’t put app.run() here – run.py calls it only when you execute
#   'python run.py', keeping production WSGI servers happy.)
# ------------------------------------------------------------------------ #

