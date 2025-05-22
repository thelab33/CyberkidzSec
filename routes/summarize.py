from flask import Blueprint, request, jsonify
from flask_cors import CORS, cross_origin
import openai, os
from dotenv import load_dotenv
load_dotenv(); openai.api_key = os.getenv("OPENAI_API_KEY")
summarize_bp = Blueprint("summarize_bp", __name__); CORS(summarize_bp)
@summarize_bp.route("/api/summarize", methods=["POST"])
@cross_origin()
def summarize():
    data = request.get_json(); text = data.get("text", ""); model = data.get("model", "gpt-4o")
    if not text: return jsonify({"error": "No text provided"}), 400
    prompt = f"Summarize this text for a security/bug bounty audience:\n\n{text}"
    response = openai.chat.completions.create(model=model, messages=[{"role": "system", "content": "You are a concise, helpful cybersecurity assistant."},{"role": "user", "content": prompt}], max_tokens=300, temperature=0.5)
    summary = response.choices[0].message.content.strip()
    return jsonify({"summary": summary})
