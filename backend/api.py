
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import ast
import datetime
from recommendation_engine import get_recommendations, query_mistral, store_ai_recommendations

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Helper function to convert SQLite row to dict
def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

# Root endpoint to verify API is running
@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "API is running", "message": "Welcome to the E-commerce Recommendation API"})

# Get customer details
@app.route('/customer/<customer_id>', methods=['GET'])
def get_customer(customer_id):
    conn = sqlite3.connect('ecommerce.db')
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM customers WHERE customer_id = ?", (customer_id,))
    customer = cursor.fetchone()
    
    if not customer:
        return jsonify({"error": "Customer not found"}), 404
    
    # Parse string lists back into Python lists
    if customer and 'browsing_history' in customer:
        customer['browsing_history'] = ast.literal_eval(customer['browsing_history'])
    
    if customer and 'purchase_history' in customer:
        customer['purchase_history'] = ast.literal_eval(customer['purchase_history'])
    
    conn.close()
    return jsonify(customer)

# Get recommendations for a customer
@app.route('/recommendations/<customer_id>', methods=['GET'])
def get_recommendations_api(customer_id):
    # First check if there are stored recommendations
    conn = sqlite3.connect('ecommerce.db')
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT r.*, p.category, p.subcategory, p.brand, p.price, p.rating
        FROM recommendations r
        JOIN products p ON r.product_id = p.product_id
        WHERE r.customer_id = ?
        ORDER BY r.timestamp DESC
        LIMIT 5
    """, (customer_id,))
    
    stored_recommendations = cursor.fetchall()
    
    # If no stored recommendations, generate new ones
    if not stored_recommendations:
        recommendations, browsing_history, purchase_history = get_recommendations(customer_id)
        
        # If recommendations is a string, it's an error message
        if isinstance(recommendations, str):
            return jsonify({"error": recommendations}), 404
        
        if recommendations:
            formatted_recommendations = "\n".join([f"- {p[0]} ({p[1]} > {p[2]}, Brand: {p[3]})" for p in recommendations])
            
            prompt = f"""
            The customer has previously purchased: {purchase_history}
            The customer has browsed: {browsing_history}
            Based on this behavior, we are recommending:
            {formatted_recommendations}
            
            Please provide a brief explanation for EACH product recommendation individually, explaining why it's relevant to this customer.
        Number your responses to match each product in order and give some reallife products name related to that for as an example like iphone14.
            """
            
            ai_response = query_mistral(prompt)
            
            # Parse AI response into individual explanations
            explanation_lines = []
            current_explanation = ""
            
            # Process the AI response line by line to extract explanations
            for line in ai_response.splitlines():
                line = line.strip()
                if not line:
                    continue
                    
                # Check if this line starts a new numbered explanation
                if line[0].isdigit() and line[1:3] in ['. ', '- ', ') ']:
                    if current_explanation:
                        explanation_lines.append(current_explanation)
                    current_explanation = line
                else:
                    current_explanation += " " + line
                    
            # Add the last explanation
            if current_explanation:
                explanation_lines.append(current_explanation)
                
            # Ensure we have enough explanations for all recommendations
            while len(explanation_lines) < len(recommendations):
                default_msg = f"Based on your browsing and purchase history in {recommendations[len(explanation_lines)][1]}."
                explanation_lines.append(default_msg)
                
            # Process AI recommendations
            processed_recommendations = [
                (p[0], p[1], p[2], p[3], f"AI Analysis: {explanation_lines[i] if i < len(explanation_lines) else 'Based on browsing and purchase history'}")
                for i, p in enumerate(recommendations)
            ]
            
            store_ai_recommendations(customer_id, processed_recommendations)
            
            # Fetch the newly stored recommendations
            cursor.execute("""
                SELECT r.*, p.category, p.subcategory, p.brand, p.price, p.rating
                FROM recommendations r
                JOIN products p ON r.product_id = p.product_id
                WHERE r.customer_id = ?
                ORDER BY r.timestamp DESC
                LIMIT 5
            """, (customer_id,))
            
            stored_recommendations = cursor.fetchall()
    
    # Format the recommendations for the API response
    formatted_recommendations = []
    for rec in stored_recommendations:
        # Ensure we always have a reason, even if it's a default one
        recommendation_reason = rec["recommendation_reason"]
        if not recommendation_reason or recommendation_reason.strip() == "":
            recommendation_reason = f"AI Analysis: This {rec['category']} product from {rec['brand']} aligns with your browsing patterns."
        
        formatted_recommendations.append({
            "product_id": rec["product_id"],
            "category": rec["category"],
            "subcategory": rec["subcategory"],
            "brand": rec["brand"],
            "price": rec["price"],
            "rating": rec["rating"],
            "recommendation_reason": recommendation_reason
        })
    
    conn.close()
    return jsonify(formatted_recommendations)

if __name__ == '__main__':
    print("Starting Flask API server on http://localhost:5000")
    app.run(debug=True)
