# 🏥 Chronic Disease Risk Assessment API Documentation

A comprehensive REST API for chronic disease risk assessment using trained machine learning models.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Request/Response Examples](#request-response-examples)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Client Libraries](#client-libraries)

---

## 🚀 Getting Started

### Base URL
```
http://localhost:5000/api
```

### Prerequisites
- API server must be running (`python api_server.py`)
- Models must be trained and loaded
- Python `requests` library for client interactions

### Content-Type
All POST requests must include:
```
Content-Type: application/json
```

---

## 🔐 Authentication

Currently, the API does not require authentication. For production deployment, consider implementing:
- API key authentication
- JWT tokens
- OAuth 2.0

---

## 📊 API Endpoints

### 1. Health Check
**GET** `/api/health`

Check API server status and model availability.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00",
  "system_ready": true,
  "available_models": ["diabetes", "heart_disease", "stroke", "kidney_disease", "hypertension", "copd"],
  "models_count": 6
}
```

### 2. Models Information
**GET** `/api/models`

Get detailed information about available disease models.

**Response:**
```json
{
  "available_models": {
    "diabetes": {
      "name": "diabetes",
      "model_type": "GradientBoostingClassifier",
      "available": true,
      "risk_categories": ["Low Risk", "Moderate Risk", "High Risk", "Very High Risk"]
    },
    "heart_disease": {
      "name": "heart_disease", 
      "model_type": "RandomForestClassifier",
      "available": true,
      "risk_categories": ["Low Risk", "Moderate Risk", "High Risk", "Very High Risk"]
    }
  },
  "total_models": 6,
  "supported_diseases": ["diabetes", "heart_disease", "stroke", "kidney_disease", "hypertension", "copd"]
}
```

### 3. Single Patient Assessment
**POST** `/api/assess`

Assess chronic disease risk for a single patient.

**Request Body:**
```json
{
  "patient_id": "P001",
  "patient_data": {
    "age": 45,
    "gender": "male",
    "glucose": 126,
    "blood_pressure_systolic": 140,
    "blood_pressure_diastolic": 90,
    "cholesterol": 240,
    "hdl": 35,
    "bmi": 28.5,
    "heart_rate": 85
  },
  "diseases": ["diabetes", "heart_disease"]
}
```

**Response:**
```json
{
  "patient_id": "P001",
  "assessment_timestamp": "2024-01-20T10:30:00",
  "risk_assessments": {
    "diabetes": {
      "risk_score": 0.642,
      "risk_category": "High Risk",
      "risk_percentage": 64.2,
      "confidence": 0.89
    },
    "heart_disease": {
      "risk_score": 0.234,
      "risk_category": "Low Risk", 
      "risk_percentage": 23.4,
      "confidence": 0.76
    }
  },
  "patient_data_used": { ... },
  "recommendations": {
    "lifestyle_modifications": [
      "Adopt heart-healthy diet",
      "Regular physical exercise (150+ minutes/week)"
    ],
    "medical_consultations": [
      "Endocrinologist consultation"
    ],
    "monitoring_schedule": [
      "HbA1c testing every 3-6 months"
    ],
    "immediate_actions": []
  }
}
```

### 4. Batch Patient Assessment
**POST** `/api/assess-batch`

Assess multiple patients simultaneously.

**Request Body:**
```json
{
  "patients": [
    {
      "patient_id": "P001",
      "patient_data": {
        "age": 45,
        "gender": "male",
        "glucose": 130,
        "bmi": 28.5
      }
    },
    {
      "patient_id": "P002",
      "patient_data": {
        "age": 35,
        "gender": "female", 
        "glucose": 110,
        "bmi": 23.5
      }
    }
  ],
  "diseases": ["diabetes"]
}
```

**Response:**
```json
{
  "batch_id": "BATCH_20240120_103000",
  "total_patients": 2,
  "successful_assessments": 2,
  "failed_assessments": 0,
  "results": [
    {
      "patient_id": "P001",
      "status": "success",
      "risk_assessments": { ... },
      "recommendations": { ... }
    },
    {
      "patient_id": "P002", 
      "status": "success",
      "risk_assessments": { ... },
      "recommendations": { ... }
    }
  ],
  "assessment_timestamp": "2024-01-20T10:30:00"
}
```

### 5. Upload Hospital Reports
**POST** `/api/upload-report`

Upload and process hospital reports (PDF, DOCX, TXT).

#### Option A: Multipart File Upload
```bash
curl -X POST \
  -F "files=@patient_report.pdf" \
  -F "files=@lab_results.docx" \
  http://localhost:5000/api/upload-report
```

#### Option B: JSON with Base64
**Request Body:**
```json
{
  "files": [
    {
      "filename": "report.txt",
      "content": "UEFUSUVOVCBNRURJQ0FMIFJFUEVSVAo...",
      "encoding": "base64"
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "files_processed": 2,
  "extracted_data": {
    "glucose": 126.0,
    "blood_pressure_systolic": 140.0,
    "cholesterol": 240.0,
    "age": 45,
    "bmi": 28.5
  },
  "patient_profile": {
    "age": 45.0,
    "gender": 1,
    "glucose": 126.0,
    "blood_pressure_systolic": 140.0,
    "bmi": 28.5
  },
  "processing_timestamp": "2024-01-20T10:30:00",
  "message": "Reports processed successfully. Use patient_profile data for risk assessment."
}
```

### 6. Full Assessment Workflow
**POST** `/api/full-assessment`

Complete workflow: upload reports + extract data + assess risk.

**Request Body:**
```json
{
  "patient_id": "FULL_001",
  "patient_data": {
    "age": 52,
    "gender": "male",
    "glucose": 145,
    "blood_pressure_systolic": 150,
    "bmi": 29.8
  }
}
```

**Response:**
Combines report processing and risk assessment results.

---

## 💡 Request/Response Examples

### Python Client Example

```python
import requests
import json

# Base URL
BASE_URL = "http://localhost:5000/api"

# 1. Health Check
response = requests.get(f"{BASE_URL}/health")
print(response.json())

# 2. Single Patient Assessment
patient_data = {
    "patient_id": "EXAMPLE_001",
    "patient_data": {
        "age": 45,
        "gender": "male",
        "glucose": 130,
        "blood_pressure_systolic": 140,
        "bmi": 28.5
    },
    "diseases": ["diabetes", "heart_disease"]
}

response = requests.post(
    f"{BASE_URL}/assess",
    json=patient_data,
    headers={'Content-Type': 'application/json'}
)

if response.status_code == 200:
    assessment = response.json()
    print(f"Patient {assessment['patient_id']} Risk Assessment:")
    for disease, risk in assessment['risk_assessments'].items():
        print(f"  {disease}: {risk['risk_category']} ({risk['risk_percentage']:.1f}%)")
else:
    print(f"Error: {response.status_code} - {response.text}")

# 3. File Upload
with open('patient_report.txt', 'rb') as f:
    files = {'files': ('patient_report.txt', f, 'text/plain')}
    response = requests.post(f"{BASE_URL}/upload-report", files=files)
    
if response.status_code == 200:
    result = response.json()
    print("Extracted patient profile:", result['patient_profile'])
```

### cURL Examples

```bash
# Health Check
curl -X GET http://localhost:5000/api/health

# Models Info
curl -X GET http://localhost:5000/api/models

# Single Assessment
curl -X POST http://localhost:5000/api/assess \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "CURL_001",
    "patient_data": {
      "age": 45,
      "glucose": 130,
      "bmi": 28.5
    },
    "diseases": ["diabetes"]
  }'

# File Upload
curl -X POST http://localhost:5000/api/upload-report \
  -F "files=@patient_report.pdf"
```

### JavaScript Example

```javascript
// Single Patient Assessment
const assessPatient = async (patientData) => {
  try {
    const response = await fetch('http://localhost:5000/api/assess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patient_id: 'JS_001',
        patient_data: patientData,
        diseases: ['diabetes', 'heart_disease']
      })
    });
    
    if (response.ok) {
      const assessment = await response.json();
      console.log('Assessment:', assessment);
      return assessment;
    } else {
      console.error('Assessment failed:', response.statusText);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Usage
assessPatient({
  age: 45,
  gender: 'male',
  glucose: 130,
  blood_pressure_systolic: 140,
  bmi: 28.5
});
```

---

## ⚠️ Error Handling

### Common HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request data |
| 404 | Not Found | Endpoint not found |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Models not loaded |

### Error Response Format

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "timestamp": "2024-01-20T10:30:00"
}
```

### Common Errors

#### 1. No Models Available (503)
```json
{
  "error": "No models available",
  "message": "System needs to be set up first"
}
```

#### 2. Invalid Patient Data (400)
```json
{
  "error": "No patient data provided",
  "message": "patient_data field is required"
}
```

#### 3. Insufficient Data (400)
```json
{
  "error": "No risk assessments generated",
  "message": "Insufficient data or unsupported diseases",
  "available_diseases": ["diabetes", "heart_disease"]
}
```

---

## 🔧 Patient Data Fields

### Required Fields
- `age` (number): Patient age in years
- `gender` (string): "male", "female", "m", "f", or numeric (1=male, 0=female)

### Common Optional Fields
- `glucose` (number): Fasting glucose level (mg/dl)
- `blood_pressure_systolic` (number): Systolic BP (mmHg)
- `blood_pressure_diastolic` (number): Diastolic BP (mmHg)
- `cholesterol` (number): Total cholesterol (mg/dl)
- `hdl` (number): HDL cholesterol (mg/dl)
- `bmi` (number): Body Mass Index
- `heart_rate` (number): Heart rate (bpm)

### Disease-Specific Fields

#### Diabetes Model
- `pregnancies` (number): Number of pregnancies
- `skin_thickness` (number): Skin fold thickness
- `insulin` (number): Insulin level
- `diabetes_pedigree` (number): Diabetes pedigree function

#### Heart Disease Model
- `chest_pain_type` (number): Type of chest pain (0-3)
- `max_heart_rate` (number): Maximum heart rate achieved
- `exercise_angina` (number): Exercise-induced angina (0/1)
- `oldpeak` (number): ST depression induced by exercise

#### Stroke Model
- `hypertension` (number): Hypertension status (0/1)
- `heart_disease` (number): Heart disease status (0/1)
- `smoking_status` (number): Smoking status (0-3)

---

## 🚀 Rate Limiting

Currently, no rate limiting is implemented. For production use, consider:
- Request per minute limits
- Patient assessment limits
- File upload size limits

---

## 📚 Client Libraries

### Python
```bash
pip install requests
```

### Node.js
```bash
npm install axios
# or
npm install node-fetch
```

### PHP
```php
// Using cURL or Guzzle HTTP client
```

---

## 🔧 Advanced Usage

### Batch Processing Large Datasets

```python
import requests
import json
import time

def process_large_batch(patients, batch_size=10):
    """Process large patient datasets in smaller batches"""
    results = []
    
    for i in range(0, len(patients), batch_size):
        batch = patients[i:i+batch_size]
        
        batch_data = {
            "patients": batch,
            "diseases": ["diabetes", "heart_disease"]
        }
        
        response = requests.post(
            "http://localhost:5000/api/assess-batch",
            json=batch_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            results.extend(response.json()['results'])
        else:
            print(f"Batch {i//batch_size + 1} failed: {response.text}")
        
        # Rate limiting
        time.sleep(1)
    
    return results
```

### File Upload with Progress

```python
import requests
from tqdm import tqdm

def upload_with_progress(file_path):
    """Upload file with progress bar"""
    file_size = os.path.getsize(file_path)
    
    with open(file_path, 'rb') as f:
        with tqdm(total=file_size, unit='B', unit_scale=True, desc="Uploading") as pbar:
            files = {'files': (file_path, f, 'application/pdf')}
            response = requests.post(
                "http://localhost:5000/api/upload-report",
                files=files
            )
            pbar.update(file_size)
    
    return response.json()
```

---

## 📊 Monitoring and Logging

### API Metrics to Track
- Request count per endpoint
- Response times
- Error rates
- Model prediction accuracy
- File processing success rates

### Logging Important Events
- Patient assessments
- File uploads
- Model predictions
- Error occurrences

---

## 🛡️ Security Considerations

### For Production Deployment

1. **Authentication & Authorization**
   - Implement API key or JWT authentication
   - Role-based access control

2. **Data Privacy**
   - HIPAA compliance for medical data
   - Data encryption at rest and in transit
   - Secure file handling

3. **Input Validation**
   - Validate all input data
   - Sanitize file uploads
   - Prevent injection attacks

4. **Rate Limiting & DDoS Protection**
   - Implement request throttling
   - Monitor for abuse patterns

---

## 📞 Support

For issues, questions, or feature requests:
- Check server logs for error details
- Verify model availability via `/api/health`
- Ensure proper JSON formatting
- Test with provided examples first

---

**🎉 Happy coding with the Chronic Disease Risk Assessment API!**
