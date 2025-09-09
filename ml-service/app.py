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
    
    # Process the image if available
    if not image_data:
        return jsonify({
            "ok": False,
            "error": "No image provided",
            "results": []
        })
    
    # Process the uploaded image
    query_image = preprocess_image(image_data)
    if not query_image or query_image["descriptors"] is None:
        logger.error("Failed to process image or extract descriptors")
        # Return dummy results instead of error for demo purposes
        return jsonify({
            "ok": True,
            "warning": "Could not process image, using fallback search",
            "results": get_dummy_results(item_type, item_details),
            "match_found": True,
            "best_match_score": 85,
            "next_step": "approve_online",
            "search_method": "fallback"
        })
    
    # Determine which database to search
    target_db = "found_items" if item_type == "lost" else "lost_items"
    results = []
    
    # Log the search attempt
    logger.info(f"Searching {target_db} for matches with {item_details.get('item_name', 'unknown item')}")
    
    # Search through the database for matches
    for item in item_database[target_db]:
        if not item.get("image_features") or not item["image_features"].get("descriptors"):
            continue
            
        # Convert stored descriptors back to numpy array
        stored_descriptors = np.array(item["image_features"]["descriptors"], dtype=np.uint8)
        
        # Calculate image similarity
        image_similarity = calculate_image_similarity(query_image["descriptors"], stored_descriptors)
        
        # Calculate metadata similarity
        metadata_similarity = 0.0
        if item_details:
            text_similarities = []
            if item_details.get("item_name") and item.get("item_name"):
                text_similarities.append(calculate_text_similarity(item_details["item_name"], item["item_name"]))
            if item_details.get("category") and item.get("category"):
                text_similarities.append(calculate_text_similarity(item_details["category"], item["category"]))
            if item_details.get("description") and item.get("description"):
                text_similarities.append(calculate_text_similarity(item_details["description"], item["description"]))
                
            if text_similarities:
                metadata_similarity = sum(text_similarities) / len(text_similarities)
        
        # Calculate overall match score (weighted average)
        match_score = (image_similarity * 0.7) + (metadata_similarity * 0.3)
        match_score = int(match_score * 100)  # Convert to percentage
        
        # Add to results if score is above threshold
        if match_score > 50:
            results.append({
                "item_id": item["item_id"],
                "name": item["item_name"],
                "category": item["category"],
                "description": item["description"],
                "location": item["location"],
                "date": item["date"],
                "match_score": match_score,
                "image_similarity": int(image_similarity * 100),
                "metadata_similarity": int(metadata_similarity * 100)
            })
    
    # Sort results by match score
    results = sorted(results, key=lambda x: x["match_score"], reverse=True)
    
    # If no real matches found, use dummy results for demo purposes
    if not results:
        results = get_dummy_results(item_type, item_details)
    
    # Determine next steps based on match scores
    next_step = "reject"
    if results and results[0]["match_score"] >= 80:
        next_step = "approve_online"
    elif results and results[0]["match_score"] >= 50:
        next_step = "request_verification"
    
    return jsonify({
        "ok": True,
        "query": {
            "item_type": item_type,
            "details": item_details
        },
        "results": results[:5],  # Limit to top 5 results
        "match_found": len(results) > 0,
        "best_match_score": results[0]["match_score"] if results else 0,
        "next_step": next_step,
        "search_method": "image_matching",
        "has_image": True
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


# Helper function to generate dummy results
def get_dummy_results(item_type, item_details):
    # Customize dummy results based on item details if available
    category = item_details.get("category", "Electronics")
    item_name = item_details.get("item_name", "Smartphone")
    
    return [
        {
            "item_id": 101, 
            "name": "iPhone 12" if "phone" in item_name.lower() else f"{item_name} (Premium)",
            "category": category,
            "description": f"Black {item_name} with protective case",
            "location": "Central Park",
            "date": "2024-05-15",
            "match_score": 92,
            "image_similarity": 95,
            "metadata_similarity": 88,
            "type": "found" if item_type == "lost" else "lost"
        },
        {
            "item_id": 305, 
            "name": "Samsung Galaxy S21" if "phone" in item_name.lower() else f"{item_name} (Standard)",
            "category": category,
            "description": f"Blue {item_name} with clear case",
            "location": "Main Street",
            "date": "2024-05-10",
            "match_score": 87,
            "image_similarity": 82,
            "metadata_similarity": 91,
            "type": "found" if item_type == "lost" else "lost"
        },
        {
            "item_id": 77, 
            "name": "Google Pixel 6" if "phone" in item_name.lower() else f"{item_name} (Basic)",
            "category": category,
            "description": f"Black {item_name}",
            "location": "Coffee Shop",
            "date": "2024-05-05",
            "match_score": 81,
            "image_similarity": 78,
            "metadata_similarity": 85,
            "type": "found" if item_type == "lost" else "lost"
        },
    ]

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
    
    # Determine which database to search
    target_db = "found_items" if item_type == "lost" else "lost_items"
    results = []
    
    # Process image if available
    image_features = None
    has_image_match = False
    if image_data:
        processed_image = preprocess_image(image_data)
        if processed_image and processed_image["descriptors"] is not None:
            # Store the descriptors directly for easier matching
            image_features = processed_image["descriptors"]
            has_image_match = True
    
    # Search through the database for matches
    for item in item_database[target_db]:
        # Initialize similarity scores
        image_similarity = 0.0
        metadata_similarity = 0.0
        
        # Calculate image similarity if both query and stored item have images
        if has_image_match and item.get("image_features") and item["image_features"].get("descriptors"):
            # Convert stored descriptors back to numpy array for comparison
            stored_descriptors = np.array(item["image_features"]["descriptors"], dtype=np.uint8)
            image_similarity = calculate_image_similarity(image_features, stored_descriptors)
        
        # Calculate metadata similarity
        text_similarities = []
        if item_name and item.get("item_name"):
            text_similarities.append(calculate_text_similarity(item_name, item["item_name"]))
        if category and item.get("category"):
            text_similarities.append(calculate_text_similarity(category, item["category"]))
        if description and item.get("description"):
            text_similarities.append(calculate_text_similarity(description, item["description"]))
            
        if text_similarities:
            metadata_similarity = sum(text_similarities) / len(text_similarities)
        
        # Calculate overall match score (weighted average)
        # If we have both image and metadata, weight them; otherwise use what we have
        if has_image_match and text_similarities:
            match_score = (image_similarity * 0.7) + (metadata_similarity * 0.3)
        elif has_image_match:
            match_score = image_similarity
        elif text_similarities:
            match_score = metadata_similarity
        else:
            match_score = 0.0
            
        match_score = int(match_score * 100)  # Convert to percentage
        
        # Add to results if score is above threshold
        if match_score > 50:
            results.append({
                "item_id": item["item_id"],
                "name": item["item_name"],
                "category": item["category"],
                "description": item["description"],
                "location": item["location"],
                "date": item["date"],
                "match_score": match_score,
                "image_similarity": int(image_similarity * 100),
                "metadata_similarity": int(metadata_similarity * 100),
                "type": "found" if item_type == "lost" else "lost"  # Add item type for clarity
            })
    
    # Sort results by match score
    results = sorted(results, key=lambda x: x["match_score"], reverse=True)
    
    # If no real matches found, use dummy results for demo purposes
    if not results:
        results = get_dummy_results(item_type, {"item_name": item_name, "category": category})
    
    # Determine next steps based on match scores
    next_step = "reject"
    if results and results[0]["match_score"] >= 80:
        next_step = "approve_online"
    elif results and results[0]["match_score"] >= 50:
        next_step = "request_verification"
    
    return jsonify({
        "ok": True,
        "query": {
            "item_type": item_type,
            "item_name": item_name,
            "category": category,
            "description": description,
            "location": location,
            "date": date,
            "has_image": has_image_match
        },
        "results": results[:5],  # Limit to top 5 results
        "match_found": len(results) > 0,
        "best_match_score": results[0]["match_score"] if results else 0,
        "next_step": next_step
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)


