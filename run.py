"""
run.py  –  Dev launcher

• Imports the Flask “app” object from src.app
• Only starts the built-in dev server when executed directly
  (so a production WSGI server can still `import app` cleanly)
"""

from src.app import app   # <-- pulls in the instance we created in src/app.py

if __name__ == "__main__":
    # Debug/auto-reload on by default; change as you wish
    app.run(host="0.0.0.0", port=5000, debug=True)

