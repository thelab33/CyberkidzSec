# src/models.py
# ─────────────────────────────────────────────────────────────────────────────
#  Database Models for CYBERKIDZSEC Vault
# ─────────────────────────────────────────────────────────────────────────────

from datetime import datetime
from src.app import db

class Report(db.Model):
    __tablename__ = 'reports'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    slug = db.Column(db.String(256), unique=True, nullable=False)
    severity = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Report {self.slug} ({self.severity})>"

