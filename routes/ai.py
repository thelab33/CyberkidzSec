from flask import Blueprint, request, jsonify, Response
from flask_cors import CORS, cross_origin
import openai, os
from dotenv import load_dotenv
load_dotenv(); openai.api_key = os.getenv("OPENAI_API_KEY")
ai_bp = Blueprint("ai_bp", __name__); CORS(ai_bp)
@ai_bp.route("/api/ai-chat", methods=["POST"])
@cross_origin()
def ai_chat():
    data = request.get_json(); messages = data.get("messages", []); model = data.get("model", "gpt-4o")
    def stream():
        response = openai.chat.completions.create(model=model, messages=messages, stream=True, max_tokens=2048, temperature=0.7)
        for chunk in response:
            content = chunk.choices[0].delta.content if chunk.choices[0].delta else ""
            if content: yield content
    return Response(stream(), mimetype='text/plain')
