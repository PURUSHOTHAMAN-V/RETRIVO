from flask import Flask, request, jsonify

app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify({"ok": True, "message": "ML service is running"})


@app.post("/match-image")
def match_image():
    payload = request.get_json(silent=True) or {}
    dummy_results = [
        {"item_id": 101, "score": 0.92},
        {"item_id": 305, "score": 0.87},
        {"item_id": 77, "score": 0.81},
    ]
    return jsonify({
        "ok": True,
        "query": payload.get("meta", "image"),
        "results": dummy_results,
    })


@app.post("/match-text")
def match_text():
    payload = request.get_json(silent=True) or {}
    query = payload.get("query", "")
    candidates = [
        {"text": "Found leather wallet near metro station", "score": 0.89},
        {"text": "Found black iPhone 12 at park bench", "score": 0.84},
        {"text": "Found backpack with books in library", "score": 0.79},
    ]
    return jsonify({"ok": True, "query": query, "results": candidates})


@app.post("/detect-fraud")
def detect_fraud():
    payload = request.get_json(silent=True) or {}
    return jsonify({
        "ok": True,
        "risk_score": 0.18,
        "risk_level": "Low",
        "details": {"rules": ["velocity_check", "account_age"], "input": payload},
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)


