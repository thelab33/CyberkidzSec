from flask import Blueprint, request, jsonify
import openai, os

copilot = Blueprint("copilot", __name__)

@copilot.route("/api/copilot/query", methods=["POST"])
def query():
    key = request.headers.get("X-API-Key")
    if key != os.getenv("VAULT_COPILOT_KEY"):
        return jsonify({"error": "Unauthorized"}), 403

    prompt = request.json.get("prompt", "")
    if not prompt:
        return jsonify({"error": "No prompt"}), 400

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return jsonify(response.choices[0].message)

