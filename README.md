🧠 AH Curation AI
Team Name: The Blackhat Legends
Track: Technology Track – AH Hackathon 2025

🚀 Project Overview
AH Curation AI is an intelligent content recommendation system powered by a multi-agent architecture. It adapts dynamically to user behavior and feedback to deliver personalized suggestions. It integrates knowledge graphs to understand deep product relationships and continuously improves using behavioral feedback stored in memory.

🌟 Key Features
🤖 Multi-Agent System: Customer, Product, and Recommendation Agents

🔄 Real-time Personalization: Based on user feedback (likes, skips, purchases)

🧠 Product Knowledge Graph: Context-aware suggestions

🗃 Feedback Memory: SQLite-powered persistent learning

💻 Interactive UI: Built using modern frontend tech (React)

🛠️ Tech Stack
Layer	Technology
Backend	Python (FastAPI / Flask)
Frontend	JavaScript (React / Vite)
Database	SQLite
AI Engine	Custom recommendation logic
Deployment	Local (dual-server run)
📹 Demo
👉 [Click here to watch the demo video](https://drive.google.com/file/d/1p0ArTlITrGhsv29GFOPTMzeGg7qadO7a/view?usp=sharing)

📁 How to Run Locally
bash
Copy
Edit
# Clone the repository
git clone https://github.com/ARULDASSAD1/AH-Curation-AI.git
cd AH-Curation-AI
🖥️ Start Backend (Python API)
bash
Copy
Edit
# Install Python dependencies
pip install -r requirements.txt

# Run the backend server
python api.py
🌐 Start Frontend (React / JavaScript)
bash
Copy
Edit
# Navigate to UI folder if it's in a subdirectory
cd UI

# Install frontend dependencies
npm install

# Run the frontend dev server
npm run dev
Ensure both frontend and backend are running for the app to function properly.

📊 Architecture Overview
Customer Agent: Gathers behavioral data

Product Agent: Queries product info and semantic relations

Recommendation Agent: Combines user and product data for suggestions

Feedback Loop: Updates SQLite with actions for improved future results

📈 Expected Impact
This AI-driven curation system is projected to boost user engagement by 20%, offering precise, personalized recommendations that adapt over time.

👨‍💻 Contributors
Aruldass – Backend, Frontend, Architecture

Hemanshu – Recommendation Logic, Integration