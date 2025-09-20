#!/usr/bin/env python3
"""
Smart Health Dashboard with Context-Aware Nudges
===============================================

A comprehensive web dashboard that provides hyper-personalized health prompts
based on risk scores, health logs, and behavioral patterns.

Features:
- Real-time risk score monitoring
- Context-aware health nudges
- Personalized recommendations
- Health trend analysis
- Interactive visualizations
"""

import os
import json
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any
import random

from flask import Flask, render_template, jsonify, request, redirect, url_for
from flask_cors import CORS
import requests

# Initialize Flask app
app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

# Configuration
DATABASE_PATH = Path('health_dashboard.db')
API_BASE_URL = "http://localhost:5000/api"

class HealthDashboard:
    """Smart Health Dashboard with Context-Aware Nudges"""
    
    def __init__(self):
        self.init_database()
        self.nudge_engine = NudgeEngine()
        
    def init_database(self):
        """Initialize SQLite database for health logs and user data"""
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                age INTEGER,
                gender TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Health logs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS health_logs (
                log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                log_date DATE,
                log_type TEXT,
                value REAL,
                unit TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
        # Risk assessments table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS risk_assessments (
                assessment_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                disease TEXT,
                risk_score REAL,
                risk_percentage REAL,
                risk_category TEXT,
                assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
        # Nudges history table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS nudge_history (
                nudge_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                nudge_type TEXT,
                message TEXT,
                context TEXT,
                shown_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                clicked BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
        conn.commit()
        conn.close()
        
        # Insert sample data if database is empty
        self.insert_sample_data()
    
    def insert_sample_data(self):
        """Insert sample users and health data for demonstration"""
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Check if data exists
        cursor.execute("SELECT COUNT(*) FROM users")
        if cursor.fetchone()[0] > 0:
            conn.close()
            return
        
        # Sample users
        sample_users = [
            ('user_001', 'John Doe', 45, 'male'),
            ('user_002', 'Sarah Smith', 38, 'female'),
            ('user_003', 'Mike Johnson', 52, 'male')
        ]
        
        cursor.executemany(
            "INSERT INTO users (user_id, name, age, gender) VALUES (?, ?, ?, ?)",
            sample_users
        )
        
        # Sample health logs (last 30 days)
        import random
        from datetime import date, timedelta
        
        log_types = [
            ('glucose', 'mg/dl'), ('blood_pressure_systolic', 'mmHg'),
            ('blood_pressure_diastolic', 'mmHg'), ('weight', 'kg'),
            ('steps', 'count'), ('sleep_hours', 'hours'),
            ('stress_level', 'scale_1_10'), ('sodium_intake', 'mg'),
            ('water_intake', 'liters'), ('exercise_minutes', 'minutes'),
            ('heart_rate', 'bpm'), ('calories_burned', 'kcal')
        ]
        
        for user_id, _, age, gender in sample_users:
            for days_ago in range(30):
                log_date = date.today() - timedelta(days=days_ago)
                
                # Generate realistic health data based on user profile
                for log_type, unit in random.sample(log_types, 6):  # Random 6 metrics per day
                    value = self.generate_realistic_value(log_type, age, gender, days_ago)
                    
                    cursor.execute(
                        """INSERT INTO health_logs 
                           (user_id, log_date, log_type, value, unit, notes) 
                           VALUES (?, ?, ?, ?, ?, ?)""",
                        (user_id, log_date, log_type, value, unit, f"Daily {log_type} reading")
                    )
        
        # Sample risk assessments
        diseases = ['diabetes', 'heart_disease', 'hypertension', 'stroke']
        for user_id, _, _, _ in sample_users:
            for disease in random.sample(diseases, 3):  # 3 random diseases per user
                risk_score = random.uniform(0.1, 0.8)
                risk_percentage = risk_score * 100
                
                if risk_percentage < 30:
                    risk_category = "Low Risk"
                elif risk_percentage < 60:
                    risk_category = "Moderate Risk"
                elif risk_percentage < 80:
                    risk_category = "High Risk"
                else:
                    risk_category = "Very High Risk"
                
                cursor.execute(
                    """INSERT INTO risk_assessments 
                       (user_id, disease, risk_score, risk_percentage, risk_category) 
                       VALUES (?, ?, ?, ?, ?)""",
                    (user_id, disease, risk_score, risk_percentage, risk_category)
                )
        
        conn.commit()
        conn.close()
    
    def generate_realistic_value(self, log_type: str, age: int, gender: str, days_ago: int) -> float:
        """Generate realistic health values based on user profile"""
        base_values = {
            'glucose': 100 + (age - 30) * 0.5,
            'blood_pressure_systolic': 120 + (age - 30) * 0.8,
            'blood_pressure_diastolic': 80 + (age - 30) * 0.3,
            'weight': 70 + (10 if gender == 'male' else 0) + random.uniform(-5, 5),
            'steps': 8000 - (age - 30) * 50,
            'sleep_hours': 7.5 + random.uniform(-1, 1),
            'stress_level': 4 + random.uniform(0, 4),
            'sodium_intake': 2300 + random.uniform(-500, 800),
            'water_intake': 2.0 + random.uniform(-0.5, 0.8),
            'exercise_minutes': 30 + random.uniform(-20, 40),
            'heart_rate': 70 + (age - 30) * 0.5,
            'calories_burned': 300 + random.uniform(-100, 200)
        }
        
        base = base_values.get(log_type, 50)
        
        # Add some trend and variation
        trend = random.uniform(-0.1, 0.1) * days_ago
        variation = random.uniform(-0.15, 0.15) * base
        
        return max(0, base + trend + variation)
    
    def get_user_dashboard_data(self, user_id: str) -> Dict[str, Any]:
        """Get comprehensive dashboard data for a user"""
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # User info
        cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
        user = cursor.fetchone()
        
        if not user:
            conn.close()
            return None
        
        # Recent health logs (last 7 days)
        cursor.execute("""
            SELECT log_type, value, unit, log_date, notes
            FROM health_logs 
            WHERE user_id = ? AND log_date >= date('now', '-7 days')
            ORDER BY log_date DESC, log_type
        """, (user_id,))
        recent_logs = cursor.fetchall()
        
        # Latest risk assessments
        cursor.execute("""
            SELECT disease, risk_score, risk_percentage, risk_category, assessment_date
            FROM risk_assessments 
            WHERE user_id = ?
            ORDER BY assessment_date DESC
        """, (user_id,))
        risk_assessments = cursor.fetchall()
        
        # Health trends (last 30 days)
        cursor.execute("""
            SELECT log_type, AVG(value) as avg_value, MIN(value) as min_value, 
                   MAX(value) as max_value, COUNT(*) as count
            FROM health_logs 
            WHERE user_id = ? AND log_date >= date('now', '-30 days')
            GROUP BY log_type
        """, (user_id,))
        trends = cursor.fetchall()
        
        conn.close()
        
        # Process data
        user_data = {
            'user_info': {
                'user_id': user[0],
                'name': user[1],
                'age': user[2],
                'gender': user[3]
            },
            'recent_logs': self.process_recent_logs(recent_logs),
            'risk_assessments': self.process_risk_assessments(risk_assessments),
            'health_trends': self.process_health_trends(trends)
        }
        
        # Generate context-aware nudges
        user_data['nudges'] = self.nudge_engine.generate_nudges(user_data)
        
        return user_data
    
    def process_recent_logs(self, logs: List) -> Dict[str, Any]:
        """Process recent health logs"""
        processed = {}
        for log_type, value, unit, date, notes in logs:
            if log_type not in processed:
                processed[log_type] = []
            processed[log_type].append({
                'value': value,
                'unit': unit,
                'date': date,
                'notes': notes
            })
        return processed
    
    def process_risk_assessments(self, assessments: List) -> List[Dict]:
        """Process risk assessments"""
        return [{
            'disease': disease,
            'risk_score': risk_score,
            'risk_percentage': risk_percentage,
            'risk_category': risk_category,
            'date': date
        } for disease, risk_score, risk_percentage, risk_category, date in assessments]
    
    def process_health_trends(self, trends: List) -> Dict[str, Any]:
        """Process health trends"""
        return {
            log_type: {
                'average': avg_val,
                'min': min_val,
                'max': max_val,
                'readings': count
            } for log_type, avg_val, min_val, max_val, count in trends
        }
    
    def log_nudge_interaction(self, user_id: str, nudge_type: str, message: str, clicked: bool = False):
        """Log nudge interactions for analytics"""
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO nudge_history (user_id, nudge_type, message, clicked)
            VALUES (?, ?, ?, ?)
        """, (user_id, nudge_type, message, clicked))
        
        conn.commit()
        conn.close()

class NudgeEngine:
    """AI-powered nudge generation engine"""
    
    def __init__(self):
        self.nudge_templates = self.load_nudge_templates()
    
    def load_nudge_templates(self) -> Dict[str, List[Dict]]:
        """Load context-aware nudge templates"""
        return {
            'high_stress': [
                {
                    'message': "Your stress levels seem high—try a quick breathing exercise",
                    'action': "Start 5-minute breathing session",
                    'icon': "🧘‍♂️",
                    'color': "blue"
                },
                {
                    'message': "Feeling stressed? Take a 10-minute walk to clear your mind",
                    'action': "Log outdoor activity",
                    'icon': "🚶‍♂️",
                    'color': "green"
                }
            ],
            'high_sodium': [
                {
                    'message': "Your last log shows high sodium intake, balance with potassium tonight",
                    'action': "Get potassium-rich food suggestions",
                    'icon': "🍌",
                    'color': "orange"
                },
                {
                    'message': "Too much salt today? Try herb-seasoned meals for dinner",
                    'action': "View low-sodium recipes",
                    'icon': "🌿",
                    'color': "green"
                }
            ],
            'low_activity': [
                {
                    'message': "Only {steps} steps today. How about a quick walk around the block?",
                    'action': "Track walking session",
                    'icon': "👟",
                    'color': "blue"
                }
            ],
            'irregular_sleep': [
                {
                    'message': "Your sleep pattern is irregular. Try a consistent bedtime routine",
                    'action': "Set sleep reminder",
                    'icon': "😴",
                    'color': "purple"
                }
            ],
            'high_glucose': [
                {
                    'message': "Glucose levels trending up. Consider a low-carb meal option",
                    'action': "View diabetes-friendly recipes",
                    'icon': "🥗",
                    'color': "red"
                }
            ],
            'high_bp': [
                {
                    'message': "Blood pressure is elevated. Time for some relaxation?",
                    'action': "Start meditation session",
                    'icon': "💆‍♂️",
                    'color': "red"
                }
            ],
            'good_progress': [
                {
                    'message': "Great job maintaining healthy habits! Keep it up! 🌟",
                    'action': "View progress report",
                    'icon': "🎉",
                    'color': "green"
                }
            ],
            'dehydration': [
                {
                    'message': "You're behind on water intake today. Stay hydrated! 💧",
                    'action': "Log water intake",
                    'icon': "💧",
                    'color': "blue"
                }
            ],
            'high_risk_alert': [
                {
                    'message': "Your {disease} risk is high. Consider scheduling a check-up",
                    'action': "Find nearby healthcare providers",
                    'icon': "🏥",
                    'color': "red"
                }
            ],
            'medication_reminder': [
                {
                    'message': "Don't forget your evening medication routine",
                    'action': "Mark medication taken",
                    'icon': "💊",
                    'color': "orange"
                }
            ]
        }
    
    def generate_nudges(self, user_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate context-aware nudges based on user data"""
        nudges = []
        recent_logs = user_data.get('recent_logs', {})
        risk_assessments = user_data.get('risk_assessments', [])
        trends = user_data.get('health_trends', {})
        
        # Analyze recent logs for triggers
        if 'stress_level' in recent_logs:
            latest_stress = recent_logs['stress_level'][0]['value']
            if latest_stress > 7:
                nudges.append(self.select_nudge('high_stress'))
        
        if 'sodium_intake' in recent_logs:
            latest_sodium = recent_logs['sodium_intake'][0]['value']
            if latest_sodium > 2500:  # High sodium threshold
                nudges.append(self.select_nudge('high_sodium'))
        
        if 'steps' in recent_logs:
            latest_steps = recent_logs['steps'][0]['value']
            if latest_steps < 5000:  # Low activity threshold
                nudge = self.select_nudge('low_activity')
                nudge['message'] = nudge['message'].format(steps=int(latest_steps))
                nudges.append(nudge)
        
        if 'glucose' in recent_logs:
            latest_glucose = recent_logs['glucose'][0]['value']
            if latest_glucose > 140:  # High glucose threshold
                nudges.append(self.select_nudge('high_glucose'))
        
        if 'blood_pressure_systolic' in recent_logs:
            latest_bp = recent_logs['blood_pressure_systolic'][0]['value']
            if latest_bp > 140:  # High BP threshold
                nudges.append(self.select_nudge('high_bp'))
        
        if 'water_intake' in recent_logs:
            latest_water = recent_logs['water_intake'][0]['value']
            if latest_water < 1.5:  # Dehydration threshold
                nudges.append(self.select_nudge('dehydration'))
        
        # Analyze risk assessments
        for assessment in risk_assessments:
            if assessment['risk_category'] in ['High Risk', 'Very High Risk']:
                nudge = self.select_nudge('high_risk_alert')
                nudge['message'] = nudge['message'].format(disease=assessment['disease'])
                nudges.append(nudge)
                break  # Only show one high-risk alert
        
        # Analyze sleep patterns
        if 'sleep_hours' in trends:
            avg_sleep = trends['sleep_hours']['average']
            if avg_sleep < 6 or avg_sleep > 9:
                nudges.append(self.select_nudge('irregular_sleep'))
        
        # Add positive reinforcement
        if len(nudges) == 0 or random.random() < 0.3:  # 30% chance of positive nudge
            nudges.append(self.select_nudge('good_progress'))
        
        # Time-based nudges
        current_hour = datetime.now().hour
        if current_hour >= 19 and current_hour <= 22:  # Evening
            nudges.append(self.select_nudge('medication_reminder'))
        
        # Limit to top 3 nudges to avoid overwhelming
        return nudges[:3]
    
    def select_nudge(self, category: str) -> Dict[str, Any]:
        """Select a random nudge from a category"""
        templates = self.nudge_templates.get(category, [])
        if not templates:
            return {
                'message': 'Keep up the great work on your health journey!',
                'action': 'View health tips',
                'icon': '💪',
                'color': 'blue'
            }
        
        nudge = random.choice(templates).copy()
        nudge['category'] = category
        nudge['timestamp'] = datetime.now().isoformat()
        return nudge

# Initialize dashboard
dashboard = HealthDashboard()

# Routes
@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('dashboard.html')

@app.route('/api/dashboard/<user_id>')
def get_dashboard_data(user_id: str):
    """API endpoint to get dashboard data for a user"""
    data = dashboard.get_user_dashboard_data(user_id)
    if not data:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(data)

@app.route('/api/nudge-click', methods=['POST'])
def log_nudge_click():
    """Log nudge click interactions"""
    data = request.get_json()
    user_id = data.get('user_id')
    nudge_type = data.get('nudge_type')
    message = data.get('message')
    
    dashboard.log_nudge_interaction(user_id, nudge_type, message, clicked=True)
    return jsonify({'status': 'logged'})

@app.route('/api/users')
def get_users():
    """Get list of users for demo purposes"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT user_id, name FROM users")
    users = [{'user_id': uid, 'name': name} for uid, name in cursor.fetchall()]
    conn.close()
    return jsonify(users)

@app.route('/api/log-health', methods=['POST'])
def log_health_data():
    """Endpoint to log new health data"""
    data = request.get_json()
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO health_logs (user_id, log_date, log_type, value, unit, notes)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        data.get('user_id'),
        data.get('log_date', datetime.now().date()),
        data.get('log_type'),
        data.get('value'),
        data.get('unit'),
        data.get('notes', '')
    ))
    
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'logged', 'message': 'Health data logged successfully'})

if __name__ == '__main__':
    print("🏥 Smart Health Dashboard with Context-Aware Nudges")
    print("=" * 60)
    print("🌐 Starting dashboard server...")
    print("   Local:    http://localhost:3000")
    print("   Features: Context-aware nudges, health tracking, risk monitoring")
    print("\n✅ Dashboard ready!")
    
    app.run(host='0.0.0.0', port=3000, debug=True)
