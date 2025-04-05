import sqlite3
import pandas as pd
import ast
import subprocess
import datetime

def initialize_database():
    """Initialize the database and tables"""
    conn = sqlite3.connect("ecommerce.db", detect_types=sqlite3.PARSE_DECLTYPES)
    cursor = conn.cursor()
    
    # Create tables
    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS customers (
        customer_id TEXT PRIMARY KEY, 
        age INTEGER, 
        gender TEXT, 
        location TEXT, 
        browsing_history TEXT, 
        purchase_history TEXT, 
        customer_segment TEXT,
        avg_order_value REAL, 
        holiday TEXT, 
        season TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
        product_id TEXT PRIMARY KEY, 
        category TEXT, 
        subcategory TEXT, 
        price REAL, 
        brand TEXT, 
        rating REAL, 
        sentiment_score REAL, 
        similar_products TEXT
    );

    CREATE TABLE IF NOT EXISTS recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT,
        product_id TEXT,
        recommendation_score REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        recommendation_reason TEXT,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
    );
    """)
    
    conn.commit()
    conn.close()

def load_csv_data():
    """Load data from CSV files into the database"""
    conn = sqlite3.connect("ecommerce.db")
    cursor = conn.cursor()
    
    # Load CSV files
    try:
        customer_df = pd.read_csv("customer_data_collection.csv")
        product_df = pd.read_csv("product_recommendation_data.csv")
        
        # Convert list strings into actual lists
        customer_df["Browsing_History"] = customer_df["Browsing_History"].apply(ast.literal_eval)
        customer_df["Purchase_History"] = customer_df["Purchase_History"].apply(ast.literal_eval)
        product_df["Similar_Product_List"] = product_df["Similar_Product_List"].apply(ast.literal_eval)
        
        # Insert Customer Data
        for _, row in customer_df.iterrows():
            cursor.execute("""
                INSERT OR REPLACE INTO customers 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (row["Customer_ID"], row["Age"], row["Gender"], row["Location"], 
                 str(row["Browsing_History"]), str(row["Purchase_History"]), 
                 row["Customer_Segment"], row["Avg_Order_Value"], row["Holiday"], row["Season"])
            )
        
        # Insert Product Data
        for _, row in product_df.iterrows():
            cursor.execute("""
                INSERT OR REPLACE INTO products 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (row["Product_ID"], row["Category"], row["Subcategory"], row["Price"], 
                 row["Brand"], row["Product_Rating"], row["Customer_Review_Sentiment_Score"], str(row["Similar_Product_List"]))
            )
        
        conn.commit()
        print("✅ Data successfully inserted into SQLite!")
        return True
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        return False
    finally:
        conn.close()

def get_recommendations(customer_id):
    """Get recommendations for a customer"""
    conn = sqlite3.connect("ecommerce.db")
    cursor = conn.cursor()
    
    cursor.execute("SELECT browsing_history, purchase_history FROM customers WHERE customer_id = ?", (customer_id,))
    customer_data = cursor.fetchone()
    
    if not customer_data:
        conn.close()
        return f"No data found for customer ID: {customer_id}", [], []
    
    browsing_history = ast.literal_eval(customer_data[0])
    purchase_history = ast.literal_eval(customer_data[1])
    
    product_ids = browsing_history + purchase_history
    
    if not product_ids:
        conn.close()
        return "No browsing or purchase history found for recommendations.", [], []
    
    # Fetch category-based recommendations
    placeholders = ",".join(["?"] * len(product_ids))
    query = f"""
        SELECT product_id, category, subcategory, brand, similar_products FROM products 
        WHERE category IN ({placeholders}) OR product_id IN ({placeholders})
    """
    cursor.execute(query, product_ids * 2)
    recommended_products = cursor.fetchall()
    
    # Expand recommendations with similar products
    expanded_recommendations = []
    for product in recommended_products:
        expanded_recommendations.append((product[0], product[1], product[2], product[3]))  # Original product
        similar_products = ast.literal_eval(product[4]) if product[4] else []
        for sp in similar_products:
            cursor.execute("SELECT product_id, category, subcategory, brand FROM products WHERE product_id = ?", (sp,))
            similar_product = cursor.fetchone()
            if similar_product:
                expanded_recommendations.append(similar_product)
    
    conn.close()
    return expanded_recommendations[:5], browsing_history, purchase_history

def query_mistral(prompt):
    """Query Mistral AI for recommendations"""
    command = ["ollama", "run", "mistral", prompt]
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            encoding="utf-8"
        )
        
        print("\n🔍 Debugging Mistral AI Response:")
        print("STDOUT:", result.stdout.strip())
        print("STDERR:", result.stderr.strip())
        
        if result.returncode != 0:
            return f"⚠️ AI Error: {result.stderr.strip()}"
        
        response = result.stdout.strip()
        return response if response else "⚠️ AI Analysis Failed: Empty response."
    
    except Exception as e:
        return f"⚠️ Exception occurred: {str(e)}"

def store_ai_recommendations(customer_id, recommendations):
    """Store AI recommendations in the database"""
    conn = sqlite3.connect("ecommerce.db")
    cursor = conn.cursor()
    
    for product_id, category, subcategory, brand, reason in recommendations:
        # Ensure we always have a reason, even if AI didn't provide one
        if not reason or reason.strip() == "" or "AI Analysis:" not in reason:
            reason = f"AI Analysis: This {category} product from {brand} aligns with your browsing and purchase history."
        
        cursor.execute("""
            INSERT INTO recommendations (customer_id, product_id, recommendation_score, timestamp, recommendation_reason)
            VALUES (?, ?, ?, ?, ?)
        """, (customer_id, product_id, 0.85, datetime.datetime.now(), reason))
    
    conn.commit()
    conn.close()
    print(f"✅ AI Recommendations stored for Customer {customer_id}.")

def generate_recommendations(customer_id):
    """Generate AI-powered recommendations for a customer"""
    recommendations, browsing_history, purchase_history = get_recommendations(customer_id)
    
    if isinstance(recommendations, str):  # If it's an error message
        return None
    
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
            explanation_lines.append(f"Based on your browsing and purchase history in {recommendations[len(explanation_lines)][1]}.")
            
        # Process AI recommendations
        processed_recommendations = [
            (p[0], p[1], p[2], p[3], f"AI Analysis: {explanation_lines[i] if i < len(explanation_lines) else 'Based on browsing and purchase history'}")
            for i, p in enumerate(recommendations)
        ]
        
        store_ai_recommendations(customer_id, processed_recommendations)
        return True
    
    return False

# If this script is run directly, initialize the database and load data
if __name__ == "__main__":
    initialize_database()
    load_csv_data()
    
    customer_id = input("Enter the customer ID: ")
    result = generate_recommendations(customer_id)
    
    if result:
        print(f"✅ Recommendations generated for customer {customer_id}")
    else:
        print(f"⚠️ Failed to generate recommendations for customer {customer_id}")
