#!/usr/bin/env python3
"""
API Client Test Script
=====================

Test script to demonstrate usage of the Chronic Disease Risk Assessment API.
This script shows how to interact with all available endpoints.

Usage: python test_api_client.py
"""

import requests
import json
import base64
from pathlib import Path

# API base URL
BASE_URL = "http://localhost:5000/api"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing Health Check Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return False

def test_models_info():
    """Test getting models information"""
    print("\n📊 Testing Models Info Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/models")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return False

def test_single_assessment():
    """Test single patient risk assessment"""
    print("\n🎯 Testing Single Patient Assessment...")
    
    # Sample patient data
    patient_data = {
        "patient_id": "TEST_PATIENT_001",
        "patient_data": {
            "age": 45,
            "gender": "male",
            "glucose": 130,
            "blood_pressure_systolic": 140,
            "blood_pressure_diastolic": 90,
            "cholesterol": 240,
            "hdl": 35,
            "bmi": 28.5,
            "heart_rate": 85,
            "pregnancies": 0  # For diabetes model
        },
        "diseases": ["diabetes", "heart_disease", "stroke"]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/assess",
            json=patient_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return False

def test_batch_assessment():
    """Test batch patient assessment"""
    print("\n👥 Testing Batch Patient Assessment...")
    
    # Sample batch data
    batch_data = {
        "patients": [
            {
                "patient_id": "BATCH_001",
                "patient_data": {
                    "age": 35,
                    "gender": "female",
                    "glucose": 110,
                    "blood_pressure_systolic": 125,
                    "bmi": 23.5,
                    "pregnancies": 2
                }
            },
            {
                "patient_id": "BATCH_002", 
                "patient_data": {
                    "age": 55,
                    "gender": "male",
                    "glucose": 150,
                    "blood_pressure_systolic": 160,
                    "cholesterol": 280,
                    "bmi": 32.0
                }
            },
            {
                "patient_id": "BATCH_003",
                "patient_data": {
                    "age": 28,
                    "gender": "female",
                    "glucose": 95,
                    "blood_pressure_systolic": 115,
                    "bmi": 21.0,
                    "pregnancies": 1
                }
            }
        ],
        "diseases": ["diabetes", "hypertension"]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/assess-batch",
            json=batch_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return False

def test_report_upload():
    """Test hospital report upload and processing"""
    print("\n📄 Testing Report Upload Endpoint...")
    
    # Check if sample report exists
    sample_report_path = Path("sample_patient_report.txt")
    if not sample_report_path.exists():
        print("⚠️ Sample report not found, creating one...")
        create_sample_report()
    
    try:
        # Test with file upload
        with open(sample_report_path, 'rb') as f:
            files = {'files': (sample_report_path.name, f, 'text/plain')}
            response = requests.post(f"{BASE_URL}/upload-report", files=files)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return False
    except FileNotFoundError:
        print("❌ Sample report file not found")
        return False

def test_report_upload_json():
    """Test report upload via JSON with base64 encoding"""
    print("\n📄 Testing Report Upload via JSON...")
    
    # Sample medical report content
    report_content = """
PATIENT MEDICAL REPORT

Patient: Jane Smith
Age: 38 years
Gender: Female
Date: 2024-01-20

VITAL SIGNS:
Blood Pressure: 135/85 mmHg
Heart Rate: 78 bpm
BMI: 26.2

LABORATORY RESULTS:
Fasting Glucose: 118 mg/dl
HbA1c: 5.8%
Total Cholesterol: 220 mg/dl
HDL Cholesterol: 45 mg/dl

CLINICAL NOTES:
Patient presents with borderline glucose levels.
Family history of diabetes.
"""
    
    # Encode content as base64
    encoded_content = base64.b64encode(report_content.encode('utf-8')).decode('utf-8')
    
    json_data = {
        "files": [
            {
                "filename": "test_report.txt",
                "content": encoded_content,
                "encoding": "base64"
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/upload-report",
            json=json_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return False

def test_full_assessment():
    """Test complete workflow: data + assessment"""
    print("\n🔄 Testing Full Assessment Workflow...")
    
    # Patient data for full assessment
    assessment_data = {
        "patient_id": "FULL_ASSESS_001",
        "patient_data": {
            "age": 52,
            "gender": "male",
            "glucose": 145,
            "blood_pressure_systolic": 150,
            "blood_pressure_diastolic": 95,
            "cholesterol": 260,
            "hdl": 38,
            "bmi": 29.8,
            "heart_rate": 88
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/full-assessment",
            json=assessment_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return False

def create_sample_report():
    """Create a sample medical report for testing"""
    report_content = """
PATIENT MEDICAL REPORT

Patient: Test Patient
Age: 42 years  
Gender: Male
Date: 2024-01-15

VITAL SIGNS:
Blood Pressure: 145/92 mmHg
Heart Rate: 82 bpm
Weight: 88 kg
BMI: 29.1

LABORATORY RESULTS:
Fasting Glucose: 135 mg/dl
HbA1c: 6.4%
Total Cholesterol: 255 mg/dl
HDL Cholesterol: 32 mg/dl
LDL Cholesterol: 175 mg/dl
Triglycerides: 240 mg/dl

CLINICAL NOTES:
Patient presents with elevated glucose and blood pressure levels.
Recommend lifestyle modifications and follow-up.
"""
    
    with open("sample_patient_report.txt", "w") as f:
        f.write(report_content)
    print("✅ Sample report created: sample_patient_report.txt")

def main():
    """Run all API tests"""
    print("🏥 Chronic Disease Risk Assessment API - Test Suite")
    print("=" * 70)
    
    tests = [
        ("Health Check", test_health_check),
        ("Models Info", test_models_info),
        ("Single Assessment", test_single_assessment),
        ("Batch Assessment", test_batch_assessment),
        ("Report Upload (File)", test_report_upload),
        ("Report Upload (JSON)", test_report_upload_json),
        ("Full Assessment", test_full_assessment)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        try:
            success = test_func()
            results.append((test_name, success))
            if success:
                print(f"✅ {test_name}: PASSED")
            else:
                print(f"❌ {test_name}: FAILED")
        except Exception as e:
            print(f"❌ {test_name}: ERROR - {e}")
            results.append((test_name, False))
    
    # Summary
    print(f"\n{'='*70}")
    print("📊 TEST RESULTS SUMMARY")
    print(f"{'='*70}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"  {test_name:25} {status}")
    
    print(f"\n🎯 Overall: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 All tests passed! API is working correctly.")
    else:
        print("⚠️ Some tests failed. Check the API server and try again.")

if __name__ == "__main__":
    main()
