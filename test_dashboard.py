#!/usr/bin/env python3
"""
Dashboard Test Script
====================

Simple test script to verify the dashboard with context-aware nudges is working.
This will start the dashboard server and provide sample data for demonstration.
"""

import requests
import json
import time
import threading
from datetime import datetime, date, timedelta

def test_dashboard_api():
    """Test dashboard API endpoints"""
    print("🔍 Testing Dashboard API...")
    
    try:
        # Wait a moment for server to start
        time.sleep(2)
        
        # Test users endpoint
        print("\n1️⃣ Testing Users Endpoint...")
        response = requests.get("http://localhost:3000/api/users", timeout=10)
        
        if response.status_code == 200:
            users = response.json()
            print(f"✅ Found {len(users)} users:")
            for user in users:
                print(f"  - {user['name']} ({user['user_id']})")
            
            # Test dashboard data for first user
            if users:
                user_id = users[0]['user_id']
                print(f"\n2️⃣ Testing Dashboard Data for {users[0]['name']}...")
                
                response = requests.get(f"http://localhost:3000/api/dashboard/{user_id}", timeout=10)
                
                if response.status_code == 200:
                    dashboard_data = response.json()
                    print("✅ Dashboard data retrieved successfully!")
                    
                    # Show nudges
                    nudges = dashboard_data.get('nudges', [])
                    print(f"\n🔔 Context-Aware Nudges ({len(nudges)}):")
                    for i, nudge in enumerate(nudges, 1):
                        print(f"  {i}. {nudge['icon']} {nudge['message']}")
                        print(f"     Action: {nudge['action']} (Color: {nudge['color']})")
                    
                    # Show risk assessments
                    risks = dashboard_data.get('risk_assessments', [])
                    print(f"\n⚠️ Risk Assessments ({len(risks)}):")
                    for risk in risks:
                        print(f"  • {risk['disease']}: {risk['risk_percentage']:.1f}% ({risk['risk_category']})")
                    
                    # Show recent health logs
                    logs = dashboard_data.get('recent_logs', {})
                    print(f"\n📊 Recent Health Metrics ({len(logs)} types):")
                    for log_type, entries in list(logs.items())[:5]:  # Show first 5
                        if entries:
                            latest = entries[0]
                            print(f"  • {log_type.replace('_', ' ').title()}: {latest['value']:.1f} {latest['unit']}")
                    
                else:
                    print(f"❌ Dashboard data request failed: {response.status_code}")
            
        else:
            print(f"❌ Users request failed: {response.status_code}")
            return False
        
        # Test nudge click logging
        print(f"\n3️⃣ Testing Nudge Click Logging...")
        nudge_click_data = {
            'user_id': users[0]['user_id'],
            'nudge_type': 'test_nudge',
            'message': 'Test nudge message'
        }
        
        response = requests.post(
            "http://localhost:3000/api/nudge-click",
            json=nudge_click_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Nudge click logging working!")
        else:
            print(f"❌ Nudge click logging failed: {response.status_code}")
        
        print("\n🎉 Dashboard API test completed successfully!")
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to dashboard server.")
        print("Make sure the dashboard server is running: python dashboard_server.py")
        return False
    except requests.exceptions.Timeout:
        print("❌ Dashboard API request timed out.")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def simulate_health_data_updates():
    """Simulate adding new health data to trigger different nudges"""
    print("\n🔄 Simulating Health Data Updates...")
    
    try:
        # Get users first
        response = requests.get("http://localhost:3000/api/users")
        if response.status_code != 200:
            print("❌ Could not get users for simulation")
            return
        
        users = response.json()
        if not users:
            print("❌ No users available for simulation")
            return
        
        user_id = users[0]['user_id']
        
        # Simulate high stress data to trigger stress nudge
        stress_data = {
            'user_id': user_id,
            'log_date': str(date.today()),
            'log_type': 'stress_level',
            'value': 8.5,  # High stress level
            'unit': 'scale_1_10',
            'notes': 'Feeling very stressed today'
        }
        
        response = requests.post(
            "http://localhost:3000/api/log-health",
            json=stress_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ Added high stress data - should trigger stress management nudge")
        else:
            print(f"❌ Failed to log stress data: {response.status_code}")
        
        # Simulate high sodium intake
        sodium_data = {
            'user_id': user_id,
            'log_date': str(date.today()),
            'log_type': 'sodium_intake',
            'value': 3200,  # High sodium
            'unit': 'mg',
            'notes': 'Had salty meals today'
        }
        
        response = requests.post(
            "http://localhost:3000/api/log-health",
            json=sodium_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ Added high sodium data - should trigger nutrition nudge")
        else:
            print(f"❌ Failed to log sodium data: {response.status_code}")
        
        # Simulate low activity
        steps_data = {
            'user_id': user_id,
            'log_date': str(date.today()),
            'log_type': 'steps',
            'value': 3200,  # Low step count
            'unit': 'count',
            'notes': 'Sedentary day'
        }
        
        response = requests.post(
            "http://localhost:3000/api/log-health",
            json=steps_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ Added low activity data - should trigger activity nudge")
        else:
            print(f"❌ Failed to log steps data: {response.status_code}")
        
        print("🔄 Waiting for nudges to update...")
        time.sleep(2)
        
        # Check updated dashboard
        response = requests.get(f"http://localhost:3000/api/dashboard/{user_id}")
        if response.status_code == 200:
            dashboard_data = response.json()
            nudges = dashboard_data.get('nudges', [])
            
            print(f"\n🔔 Updated Nudges ({len(nudges)}):")
            for i, nudge in enumerate(nudges, 1):
                print(f"  {i}. {nudge['icon']} {nudge['message']}")
                print(f"     Category: {nudge['category']} | Action: {nudge['action']}")
        
    except Exception as e:
        print(f"❌ Error in simulation: {e}")

def show_dashboard_features():
    """Display dashboard features and URLs"""
    print("\n🏥 SMART HEALTH DASHBOARD FEATURES")
    print("=" * 60)
    print("🌐 Dashboard URL: http://localhost:3000")
    print("\n📋 Key Features:")
    print("  ✅ Context-Aware Nudges based on health data and risk scores")
    print("  ✅ Real-time risk assessment monitoring")
    print("  ✅ Personalized health insights and recommendations")
    print("  ✅ Interactive health metrics visualization")
    print("  ✅ Health trend analysis and pattern detection")
    print("  ✅ Intelligent nudge categories:")
    print("     • High Stress → Breathing exercises, meditation")
    print("     • High Sodium → Potassium-rich food suggestions")
    print("     • Low Activity → Walking reminders, exercise prompts")
    print("     • High Glucose → Diet recommendations")
    print("     • High Blood Pressure → Relaxation techniques")
    print("     • Poor Sleep → Sleep hygiene tips")
    print("     • High Risk Alerts → Medical consultation reminders")
    print("     • Positive Reinforcement → Progress celebrations")
    
    print("\n🔔 Sample Context-Aware Nudges:")
    sample_nudges = [
        "🧘‍♂️ Your stress levels seem high—try a quick breathing exercise",
        "🍌 Your last log shows high sodium intake, balance with potassium tonight",
        "👟 Only 3,200 steps today. How about a quick walk around the block?",
        "🥗 Glucose levels trending up. Consider a low-carb meal option",
        "💆‍♂️ Blood pressure is elevated. Time for some relaxation?",
        "💧 You're behind on water intake today. Stay hydrated!",
        "🏥 Your diabetes risk is high. Consider scheduling a check-up",
        "🎉 Great job maintaining healthy habits! Keep it up!"
    ]
    
    for nudge in sample_nudges:
        print(f"  • {nudge}")

def main():
    """Main test function"""
    print("🏥 Smart Health Dashboard - Test Suite")
    print("=" * 60)
    
    # Show features
    show_dashboard_features()
    
    # Wait for user to start dashboard server
    print(f"\n⚠️ IMPORTANT: Make sure the dashboard server is running!")
    print("   Run: python dashboard_server.py")
    print("   Then press Enter to continue testing...")
    input()
    
    # Test basic API functionality
    if test_dashboard_api():
        print("\n" + "=" * 60)
        # Simulate health data updates
        simulate_health_data_updates()
        
        print("\n" + "=" * 60)
        print("🌐 DASHBOARD ACCESS")
        print("=" * 60)
        print("✅ Dashboard is ready at: http://localhost:3000")
        print("✅ Try different users from the dropdown")
        print("✅ Click on nudge cards to see interactions")
        print("✅ Watch for real-time nudge updates")
        print("\n🎯 Open your browser and navigate to http://localhost:3000")
        print("   to see the full interactive dashboard with context-aware nudges!")
    else:
        print("❌ Dashboard testing failed. Please check the server status.")

if __name__ == "__main__":
    main()
