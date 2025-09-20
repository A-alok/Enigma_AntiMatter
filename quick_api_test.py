#!/usr/bin/env python3
"""
Quick API Test - Health Check
============================

Simple test to verify the API server is running and responding.
"""

import requests
import json

def test_api():
    """Test the API health endpoint"""
    print("🔍 Testing Chronic Disease API...")
    
    try:
        # Test health endpoint
        print("\n1️⃣ Testing Health Check...")
        response = requests.get("http://localhost:5000/api/health", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            health_data = response.json()
            print("✅ API is healthy!")
            print(f"Available Models: {health_data.get('models_count', 0)}")
            print(f"Models: {', '.join(health_data.get('available_models', []))}")
        else:
            print("❌ API health check failed")
            return False
        
        # Test models endpoint
        print("\n2️⃣ Testing Models Info...")
        response = requests.get("http://localhost:5000/api/models", timeout=10)
        
        if response.status_code == 200:
            models_data = response.json()
            print("✅ Models info retrieved successfully!")
            print(f"Total Models: {models_data.get('total_models', 0)}")
            print(f"Supported Diseases: {', '.join(models_data.get('supported_diseases', []))}")
        else:
            print("❌ Models info failed")
        
        # Test simple patient assessment
        print("\n3️⃣ Testing Patient Assessment...")
        patient_data = {
            "patient_id": "QUICK_TEST_001",
            "patient_data": {
                "age": 45,
                "gender": "male", 
                "glucose": 130,
                "blood_pressure_systolic": 140,
                "bmi": 28.5
            },
            "diseases": ["diabetes"]
        }
        
        response = requests.post(
            "http://localhost:5000/api/assess",
            json=patient_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            assessment = response.json()
            print("✅ Patient assessment successful!")
            print(f"Patient ID: {assessment.get('patient_id')}")
            
            for disease, risk in assessment.get('risk_assessments', {}).items():
                risk_pct = risk.get('risk_percentage', 0)
                risk_cat = risk.get('risk_category', 'Unknown')
                print(f"  {disease}: {risk_cat} ({risk_pct:.1f}%)")
                
            recommendations = assessment.get('recommendations', {})
            if recommendations.get('lifestyle_modifications'):
                print("Recommendations:")
                for rec in recommendations['lifestyle_modifications'][:2]:
                    print(f"  • {rec}")
        else:
            print("❌ Patient assessment failed")
            print(f"Error: {response.text}")
            
        print("\n🎉 API test completed successfully!")
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server.")
        print("Make sure the API server is running: python api_server.py")
        return False
    except requests.exceptions.Timeout:
        print("❌ API request timed out.")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    test_api()
