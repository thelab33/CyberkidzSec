# src/extensions.py
# ─────────────────────────────────────────────────────────────────────────────
#  Shared extension instances for CYBERKIDZSEC Vault
# ─────────────────────────────────────────────────────────────────────────────

from flask_caching import Cache
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Cache configuration matches previous settings
cache = Cache(config={
    "CACHE_TYPE": "SimpleCache",
    "CACHE_DEFAULT_TIMEOUT": 300,
})

# Database and migrations
# SQLAlchemy instance
db = SQLAlchemy()
# Flask-Migrate instance, tied to db
migrate = Migrate(db=db)

