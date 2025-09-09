from flask import Flask, request, jsonify
import numpy as np
import cv2
import base64
import io
from PIL import Image
from thefuzz import fuzz
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                   handlers=[logging.FileHandler("ml_service.log"),
                             logging.StreamHandler()])
logger = logging.getLogger(__name__)

# In-memory database for demo purposes
item_database = {
    "found_items": [],
    "lost_items": []
}

@app.get("/health")
def health():
    return jsonify({
        "ok": True, 
        "message": "ML service is running",
        "found_items": len(item_database['found_items']),
        "lost_items": len(item_database['lost_items'])
    })

# Helper functions for image processing
def preprocess_image(image_data):
    """Convert base64 image to OpenCV format and extract ORB features"""
    try:
        # Decode base64 image
        if isinstance(image_data, str) and image_data.startswith('data:image'):
            # Handle data URL format
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to OpenCV format
        open_cv_image = np.array(image) 
        open_cv_image = open_cv_image[:, :, ::-1].copy() # Convert RGB to BGR
        
        # Extract ORB features
        orb = cv2.ORB_create()
        keypoints, descriptors = orb.detectAndCompute(open_cv_image, None)
        
        if descriptors is None:
            return None
            
        return {
            "image": open_cv_image,
            "keypoints": keypoints,
            "descriptors": descriptors
        }
    except Exception as e:
        logger.error(f"Error preprocessing image: {e}")
        return None

def calculate_image_similarity(desc1, desc2):
    """Calculate similarity between two image descriptors using feature matching"""
    try:
        if desc1 is None or desc2 is None:
            return 0.0
            
        # Use BFMatcher with Hamming distance
        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        matches = bf.match(desc1, desc2)
        
        # Sort matches by distance
        matches = sorted(matches, key=lambda x: x.distance)
        
        # Calculate similarity score (0-1)
        if len(matches) > 0:
            # Use the average distance of top matches
            top_matches = matches[:min(30, len(matches))]
            avg_distance = sum(m.distance for m in top_matches) / len(top_matches)
            # Convert distance to similarity (lower distance = higher similarity)
            max_distance = 100  # Typical max distance for ORB
            similarity = max(0, 1 - (avg_distance / max_distance))
            return similarity
        else:
            return 0.0
    except Exception as e:
        logger.error(f"Error calculating image similarity: {e}")
        return 0.0

def calculate_text_similarity(text1, text2):
    """Calculate similarity between two text strings using fuzzy matching"""
    if not text1 or not text2:
        return 0.0
    
    # Combine ratio and partial ratio for better matching
    ratio = fuzz.ratio(text1.lower(), text2.lower()) / 100.0
    partial_ratio = fuzz.partial_ratio(text1.lower(), text2.lower()) / 100.0
    token_sort_ratio = fuzz.token_sort_ratio(text1.lower(), text2.lower()) / 100.0
    
    # Weighted average
    return (0.3 * ratio + 0.4 * partial_ratio + 0.3 * token_sort_ratio)

@app.post("/match-image")
def match_image():
    payload = request.get_json(silent=True) or {}
    
    # Extract data from payload
    image_data = payload.get("image")
    item_type = payload.get("item_type", "lost")  # 'lost' or 'found'
    item_details = payload.get("item_details", {})
    
    # For demo purposes, return enhanced dummy results
    dummy_results = [
        {
            "item_id": 101, 
            "name": "iPhone 12",
            "category": "Electronics",
            "description": "Black iPhone with red case",
            "location": "Central Park",
            "date": "2024-05-15",
            "match_score": 92,
            "image_similarity": 95,
            "metadata_similarity": 88
        },
        {
            "item_id": 305, 
            "name": "Samsung Galaxy S21",
            "category": "Electronics",
            "description": "Blue smartphone with clear case",
            "location": "Main Street",
            "date": "2024-05-10",
            "match_score": 87,
            "image_similarity": 82,
            "metadata_similarity": 91
        },
        {
            "item_id": 77, 
            "name": "Google Pixel 6",
            "category": "Electronics",
            "description": "Black smartphone",
            "location": "Coffee Shop",
            "date": "2024-05-05",
            "match_score": 81,
            "image_similarity": 78,
            "metadata_similarity": 85
        },
    ]
    
    # Determine next steps based on match scores
    next_step = "reject"
    if dummy_results and dummy_results[0]["match_score"] >= 80:
        next_step = "approve_online"
    elif dummy_results and dummy_results[0]["match_score"] >= 50:
        next_step = "request_verification"
    
    return jsonify({
        "ok": True,
        "query": {
            "item_type": item_type,
            "details": item_details
        },
        "results": dummy_results,
        "match_found": len(dummy_results) > 0,
        "best_match_score": dummy_results[0]["match_score"] if dummy_results else 0,
        "next_step": next_step
    })


@app.post("/match-text")
def match_text():
    payload = request.get_json(silent=True) or {}
    
    # Extract query text and metadata
    query_text = payload.get("text", "")
    item_name = payload.get("item_name", "")
    category = payload.get("category", "")
    description = payload.get("description", "")
    location = payload.get("location", "")
    date = payload.get("date", "")
    
    # Combine text fields for matching
    combined_text = f"{item_name} {category} {description}".strip()
    
    # For demo purposes, return enhanced dummy results with similarity scores
    dummy_results = [
        {
            "item_id": 101, 
            "name": "iPhone 12",
            "category": "Electronics",
            "description": "Black iPhone with red case",
            "location": "Central Park",
            "date": "2024-05-15",
            "match_score": 89,
            "name_similarity": 92,
            "category_similarity": 100,
            "description_similarity": 75,
            "location_similarity": 0,  # Different location
            "date_similarity": 90      # Close date
        },
        {
            "item_id": 305, 
            "name": "Samsung Galaxy S21",
            "category": "Electronics",
            "description": "Blue smartphone with clear case",
            "location": "Main Street",
            "date": "2024-05-10",
            "match_score": 78,
            "name_similarity": 65,
            "category_similarity": 100,
            "description_similarity": 70,
            "location_similarity": 0,  # Different location
            "date_similarity": 85      # Close date
        },
        {
            "item_id": 77, 
            "name": "Google Pixel 6",
            "category": "Electronics",
            "description": "Black smartphone",
            "location": "Coffee Shop",
            "date": "2024-05-05",
            "match_score": 65,
            "name_similarity": 40,
            "category_similarity": 100,
            "description_similarity": 60,
            "location_similarity": 0,  # Different location
            "date_similarity": 75      # Further date
        },
    ]
    
    # Determine next steps based on match scores
    next_step = "reject"
    if dummy_results and dummy_results[0]["match_score"] >= 80:
        next_step = "approve_online"
    elif dummy_results and dummy_results[0]["match_score"] >= 50:
        next_step = "request_verification"
    
    return jsonify({
        "ok": True,
        "query": {
            "text": combined_text,
            "item_name": item_name,
            "category": category,
            "description": description,
            "location": location,
            "date": date
        },
        "results": dummy_results,
        "match_found": len(dummy_results) > 0,
        "best_match_score": dummy_results[0]["match_score"] if dummy_results else 0,
        "next_step": next_step
    })


@app.post("/detect-fraud")
def detect_fraud():
    payload = request.get_json(silent=True) or {}
    return jsonify({
        "ok": True,
        "risk_score": 0.18,
        "risk_level": "Low",
        "details": {"rules": ["velocity_check", "account_age"], "input": payload},
    })


@app.post("/store-item")
def store_item():
    """Store a found or lost item in the database for future matching"""
    payload = request.get_json(silent=True) or {}
    
    # Extract item details
    item_type = payload.get("item_type", "found")  # 'found' or 'lost'
    item_id = payload.get("item_id")
    item_name = payload.get("item_name", "")
    category = payload.get("category", "")
    description = payload.get("description", "")
    location = payload.get("location", "")
    date = payload.get("date", "")
    image_data = payload.get("image")
    
    # Process image if available
    image_features = None
    if image_data:
        processed_image = preprocess_image(image_data)
        if processed_image:
            image_features = {
                "descriptors": processed_image["descriptors"].tolist() if processed_image["descriptors"] is not None else None
            }
    
    # Create item record
    item = {
        "item_id": item_id,
        "item_name": item_name,
        "category": category,
        "description": description,
        "location": location,
        "date": date,
        "image_features": image_features,
        "timestamp": str(np.datetime64('now'))
    }
    
    # Store in appropriate database
    if item_type == "found":
        item_database["found_items"].append(item)
        logger.info(f"Stored found item: {item_id}")
    else:
        item_database["lost_items"].append(item)
        logger.info(f"Stored lost item: {item_id}")
    
    return jsonify({
        "ok": True,
        "message": f"Item successfully stored in {item_type} items database",
        "item_id": item_id,
        "available_for_matching": True
    })


@app.post("/match-item")
def match_item():
    """Match a lost item against all found items or a found item against all lost items"""
    payload = request.get_json(silent=True) or {}
    
    # Extract item details
    item_type = payload.get("item_type", "lost")  # 'lost' or 'found'
    item_name = payload.get("item_name", "")
    category = payload.get("category", "")
    description = payload.get("description", "")
    location = payload.get("location", "")
    date = payload.get("date", "")
    image_data = payload.get("image")
    
    # Process image if available
    image_features = None
    if image_data:
        processed_image = preprocess_image(image_data)
        if processed_image:
            image_features = processed_image["descriptors"]
    
    # For demo purposes, return enhanced dummy results
    dummy_results = [
        {
            "item_id": 101, 
            "name": "iPhone 12",
            "category": "Electronics",
            "description": "Black iPhone with red case",
            "location": "Central Park",
            "date": "2024-05-15",
            "match_score": 92,
            "image_similarity": 95,
            "metadata_similarity": 88
        },
        {
            "item_id": 305, 
            "name": "Samsung Galaxy S21",
            "category": "Electronics",
            "description": "Blue smartphone with clear case",
            "location": "Main Street",
            "date": "2024-05-10",
            "match_score": 87,
            "image_similarity": 82,
            "metadata_similarity": 91
        },
        {
            "item_id": 77, 
            "name": "Google Pixel 6",
            "category": "Electronics",
            "description": "Black smartphone",
            "location": "Coffee Shop",
            "date": "2024-05-05",
            "match_score": 81,
            "image_similarity": 78,
            "metadata_similarity": 85
        },
    ]
    
    # Determine next steps based on match scores
    next_step = "reject"
    if dummy_results and dummy_results[0]["match_score"] >= 80:
        next_step = "approve_online"
    elif dummy_results and dummy_results[0]["match_score"] >= 50:
        next_step = "request_verification"
    
    return jsonify({
        "ok": True,
        "query": {
            "item_type": item_type,
            "item_name": item_name,
            "category": category,
            "description": description,
            "location": location,
            "date": date
        },
        "results": dummy_results,
        "match_found": len(dummy_results) > 0,
        "best_match_score": dummy_results[0]["match_score"] if dummy_results else 0,
        "next_step": next_step
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)


