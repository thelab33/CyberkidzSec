from flask import Blueprint, jsonify

status = Blueprint("status", __name__)

@status.route("/ws/status")
def ws_status():
    return jsonify({"status": "OK"})

