#!/usr/bin/env python3
"""
Chronic Disease Risk Assessment API Server
==========================================

A Flask-based REST API server that provides endpoints for chronic disease risk assessment
using the trained machine learning models.

Endpoints:
- POST /api/assess - Assess risk for a single patient
- POST /api/assess-batch - Assess risk for multiple patients
- POST /api/upload-report - Upload and process hospital reports
- GET /api/models - Get available models info
- GET /api/health - Health check endpoint

Author: Chronic Disease AI System
"""

import os
import sys
import json
import traceback
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any
import tempfile
import base64

from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Import our system components
try:
    from ultimate_chronic_disease_system import UltimateChronicDiseaseSystem
    from enhanced_chronic_disease_predictor import EnhancedChronicDiseasePredictor
    from report_processor import HospitalReportProcessor
    from multi_api_dataset_fetcher import MultiAPIDatasetFetcher
except ImportError as e:
    print(f"Error importing system components: {e}")
    print("Make sure all required files are in the same directory.")
    sys.exit(1)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global system instance
system = None
predictor = None
report_processor = None

# Configuration
UPLOAD_FOLDER = Path('api_uploads')
UPLOAD_FOLDER.mkdir(exist_ok=True)
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'json'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def initialize_system():
    """Initialize the chronic disease system"""
    global system, predictor, report_processor
    
    try:
        print("🚀 Initializing Chronic Disease Risk Assessment API...")
        
        # Initialize main system
        system = UltimateChronicDiseaseSystem()
        
        # Load existing models
        models_loaded = system.load_existing_models()
        if not models_loaded:
            print("⚠️ No trained models found. Some endpoints may not work.")
        
        # Initialize individual components
        predictor = EnhancedChronicDiseasePredictor()
        report_processor = HospitalReportProcessor()
        
        # Load models into predictor
        model_files = list(Path('.').glob('enhanced_chronic_disease_model_*.pkl'))
        for model_file in model_files:
            disease = model_file.stem.replace('enhanced_chronic_disease_model_', '')
            predictor.load_model(str(model_file), disease)
        
        print(f"✅ System initialized with {len(predictor.models)} models")
        return True
        
    except Exception as e:
        print(f"❌ Error initializing system: {e}")
        print(traceback.format_exc())
        return False

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        available_models = list(predictor.models.keys()) if predictor else []
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'system_ready': system is not None,
            'available_models': available_models,
            'models_count': len(available_models)
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/models', methods=['GET'])
def get_models_info():
    """Get information about available models"""
    try:
        if not predictor or not predictor.models:
            return jsonify({
                'error': 'No models available',
                'message': 'System needs to be set up first'
            }), 503
        
        models_info = {}
        for disease, model in predictor.models.items():
            models_info[disease] = {
                'name': disease,
                'model_type': type(model).__name__,
                'available': True,
                'risk_categories': ['Low Risk', 'Moderate Risk', 'High Risk', 'Very High Risk']
            }
        
        return jsonify({
            'available_models': models_info,
            'total_models': len(models_info),
            'supported_diseases': list(models_info.keys())
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to get models info',
            'message': str(e)
        }), 500

@app.route('/api/assess', methods=['POST'])
def assess_patient_risk():
    """
    Assess chronic disease risk for a single patient
    
    Expected JSON payload:
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
        "diseases": ["diabetes", "heart_disease"]  // Optional, defaults to all
    }
    """
    try:
        if not predictor or not predictor.models:
            return jsonify({
                'error': 'No models available',
                'message': 'System needs to be set up first'
            }), 503
        
        # Parse request data
        data = request.get_json()
        if not data:
            return jsonify({
                'error': 'No JSON data provided',
                'message': 'Request body must contain JSON data'
            }), 400
        
        patient_id = data.get('patient_id', f'API_PATIENT_{datetime.now().strftime("%Y%m%d_%H%M%S")}')
        patient_data = data.get('patient_data', {})
        requested_diseases = data.get('diseases', list(predictor.models.keys()))
        
        if not patient_data:
            return jsonify({
                'error': 'No patient data provided',
                'message': 'patient_data field is required'
            }), 400
        
        # Perform risk assessments
        risk_assessments = {}
        available_diseases = list(predictor.models.keys())
        
        for disease in requested_diseases:
            if disease not in available_diseases:
                continue
                
            # Map patient data to disease-specific features
            disease_features = _map_patient_to_disease_features(patient_data, disease)
            
            if disease_features:
                risk_result = predictor.predict_risk_score(disease_features, disease)
                if risk_result:
                    risk_assessments[disease] = risk_result
        
        if not risk_assessments:
            return jsonify({
                'error': 'No risk assessments generated',
                'message': 'Insufficient data or unsupported diseases',
                'available_diseases': available_diseases
            }), 400
        
        # Generate response
        response = {
            'patient_id': patient_id,
            'assessment_timestamp': datetime.now().isoformat(),
            'risk_assessments': risk_assessments,
            'patient_data_used': patient_data,
            'recommendations': _generate_recommendations(risk_assessments)
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'error': 'Assessment failed',
            'message': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/api/assess-batch', methods=['POST'])
def assess_batch_patients():
    """
    Assess chronic disease risk for multiple patients
    
    Expected JSON payload:
    {
        "patients": [
            {
                "patient_id": "P001",
                "patient_data": { ... }
            },
            {
                "patient_id": "P002", 
                "patient_data": { ... }
            }
        ],
        "diseases": ["diabetes", "heart_disease"]  // Optional
    }
    """
    try:
        if not predictor or not predictor.models:
            return jsonify({
                'error': 'No models available',
                'message': 'System needs to be set up first'
            }), 503
        
        data = request.get_json()
        if not data:
            return jsonify({
                'error': 'No JSON data provided'
            }), 400
        
        patients = data.get('patients', [])
        requested_diseases = data.get('diseases', list(predictor.models.keys()))
        
        if not patients:
            return jsonify({
                'error': 'No patients data provided',
                'message': 'patients array is required'
            }), 400
        
        batch_results = []
        successful_assessments = 0
        failed_assessments = 0
        
        for patient in patients:
            patient_id = patient.get('patient_id', f'BATCH_PATIENT_{len(batch_results)}')
            patient_data = patient.get('patient_data', {})
            
            try:
                # Assess this patient
                patient_assessments = {}
                
                for disease in requested_diseases:
                    if disease not in predictor.models:
                        continue
                    
                    disease_features = _map_patient_to_disease_features(patient_data, disease)
                    if disease_features:
                        risk_result = predictor.predict_risk_score(disease_features, disease)
                        if risk_result:
                            patient_assessments[disease] = risk_result
                
                if patient_assessments:
                    batch_results.append({
                        'patient_id': patient_id,
                        'status': 'success',
                        'risk_assessments': patient_assessments,
                        'recommendations': _generate_recommendations(patient_assessments)
                    })
                    successful_assessments += 1
                else:
                    batch_results.append({
                        'patient_id': patient_id,
                        'status': 'failed',
                        'error': 'No assessments generated - insufficient data'
                    })
                    failed_assessments += 1
                    
            except Exception as e:
                batch_results.append({
                    'patient_id': patient_id,
                    'status': 'failed',
                    'error': str(e)
                })
                failed_assessments += 1
        
        return jsonify({
            'batch_id': f'BATCH_{datetime.now().strftime("%Y%m%d_%H%M%S")}',
            'total_patients': len(patients),
            'successful_assessments': successful_assessments,
            'failed_assessments': failed_assessments,
            'results': batch_results,
            'assessment_timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Batch assessment failed',
            'message': str(e)
        }), 500

@app.route('/api/upload-report', methods=['POST'])
def upload_and_process_report():
    """
    Upload hospital reports and extract medical data
    
    Supports multipart/form-data with file upload or JSON with base64 encoded files
    """
    try:
        if not report_processor:
            return jsonify({
                'error': 'Report processor not available'
            }), 503
        
        files_to_process = []
        
        # Handle multipart file upload
        if 'files' in request.files:
            uploaded_files = request.files.getlist('files')
            
            for file in uploaded_files:
                if file and file.filename and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    filepath = UPLOAD_FOLDER / filename
                    file.save(filepath)
                    files_to_process.append(str(filepath))
        
        # Handle JSON with base64 files
        elif request.is_json:
            data = request.get_json()
            files_data = data.get('files', [])
            
            for file_data in files_data:
                filename = secure_filename(file_data.get('filename', 'uploaded_file.txt'))
                content = file_data.get('content', '')
                
                # Decode base64 if provided
                if file_data.get('encoding') == 'base64':
                    try:
                        content = base64.b64decode(content).decode('utf-8')
                    except Exception as e:
                        return jsonify({
                            'error': f'Failed to decode base64 content for {filename}',
                            'message': str(e)
                        }), 400
                
                # Save to temporary file
                filepath = UPLOAD_FOLDER / filename
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                files_to_process.append(str(filepath))
        
        else:
            return jsonify({
                'error': 'No files provided',
                'message': 'Upload files using multipart/form-data or provide JSON with file content'
            }), 400
        
        if not files_to_process:
            return jsonify({
                'error': 'No valid files to process',
                'message': f'Supported formats: {", ".join(ALLOWED_EXTENSIONS)}'
            }), 400
        
        # Process the reports
        processed_data = report_processor.process_multiple_reports(files_to_process)
        
        if not processed_data or 'aggregated_data' not in processed_data:
            return jsonify({
                'error': 'Failed to process reports',
                'message': 'Could not extract medical data from uploaded files'
            }), 400
        
        # Generate patient profile
        patient_profile = report_processor.generate_patient_profile(processed_data['aggregated_data'])
        
        # Clean up uploaded files
        for filepath in files_to_process:
            try:
                os.remove(filepath)
            except:
                pass
        
        return jsonify({
            'status': 'success',
            'files_processed': len(files_to_process),
            'extracted_data': processed_data['aggregated_data'],
            'patient_profile': patient_profile,
            'processing_timestamp': datetime.now().isoformat(),
            'message': 'Reports processed successfully. Use patient_profile data for risk assessment.'
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Report processing failed',
            'message': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/api/full-assessment', methods=['POST'])
def full_assessment():
    """
    Complete workflow: upload reports, extract data, and assess risk
    
    Can accept either file uploads or JSON data with patient information
    """
    try:
        patient_id = request.form.get('patient_id') or request.json.get('patient_id') if request.is_json else None
        
        # First, try to process reports if files are provided
        patient_profile = None
        
        if 'files' in request.files or (request.is_json and 'files' in request.get_json()):
            # Process reports first
            report_response = upload_and_process_report()
            if report_response[1] != 200:  # If report processing failed
                return report_response
            
            report_data = json.loads(report_response[0].data)
            patient_profile = report_data['patient_profile']
        
        # If no files, try to get patient data directly from JSON
        elif request.is_json:
            data = request.get_json()
            patient_profile = data.get('patient_data', {})
        
        if not patient_profile:
            return jsonify({
                'error': 'No patient data available',
                'message': 'Provide either files for processing or patient_data in JSON'
            }), 400
        
        # Now assess risk using the patient profile
        assessment_data = {
            'patient_id': patient_id or f'FULL_ASSESS_{datetime.now().strftime("%Y%m%d_%H%M%S")}',
            'patient_data': patient_profile
        }
        
        # Temporarily set request data for assessment
        original_json = request.get_json
        request.get_json = lambda: assessment_data
        
        # Call risk assessment
        assessment_response = assess_patient_risk()
        
        # Restore original method
        request.get_json = original_json
        
        return assessment_response
        
    except Exception as e:
        return jsonify({
            'error': 'Full assessment failed',
            'message': str(e)
        }), 500

def _map_patient_to_disease_features(patient_profile: Dict, disease: str) -> Dict:
    """Map patient profile to disease-specific features"""
    
    # Common feature mappings for different diseases
    feature_maps = {
        'diabetes': {
            'pregnancies': patient_profile.get('pregnancies', 0),
            'glucose': patient_profile.get('glucose', patient_profile.get('fasting_glucose', 100)),
            'blood_pressure': patient_profile.get('blood_pressure_systolic', patient_profile.get('systolic', 120)),
            'skin_thickness': patient_profile.get('skin_thickness', 20),
            'insulin': patient_profile.get('insulin', 100),
            'bmi': patient_profile.get('bmi', 25),
            'diabetes_pedigree': patient_profile.get('diabetes_pedigree', 0.5),
            'age': patient_profile.get('age', 30)
        },
        'heart_disease': {
            'age': patient_profile.get('age', 30),
            'sex': 1 if patient_profile.get('gender', '').lower() in ['male', 'm', '1'] else 0,
            'cp': patient_profile.get('chest_pain_type', patient_profile.get('cp', 0)),
            'trestbps': patient_profile.get('blood_pressure_systolic', patient_profile.get('systolic', 120)),
            'chol': patient_profile.get('cholesterol', 200),
            'fbs': 1 if patient_profile.get('glucose', 100) > 120 else 0,
            'restecg': patient_profile.get('rest_ecg', 0),
            'thalach': patient_profile.get('max_heart_rate', 150),
            'exang': patient_profile.get('exercise_angina', 0),
            'oldpeak': patient_profile.get('oldpeak', 0),
            'slope': patient_profile.get('slope', 1),
            'ca': patient_profile.get('ca', 0),
            'thal': patient_profile.get('thal', 2)
        },
        'stroke': {
            'age': patient_profile.get('age', 30),
            'hypertension': 1 if patient_profile.get('blood_pressure_systolic', 120) > 140 else 0,
            'heart_disease': patient_profile.get('heart_disease', 0),
            'avg_glucose_level': patient_profile.get('glucose', 100),
            'bmi': patient_profile.get('bmi', 25),
            'smoking_status': patient_profile.get('smoking_status', 0)
        }
    }
    
    return feature_maps.get(disease, patient_profile)

def _generate_recommendations(risk_assessments: Dict) -> Dict:
    """Generate recommendations based on risk assessments"""
    
    recommendations = {
        'lifestyle_modifications': [],
        'medical_consultations': [],
        'monitoring_schedule': [],
        'immediate_actions': []
    }
    
    high_risk_diseases = []
    moderate_risk_diseases = []
    
    for disease, assessment in risk_assessments.items():
        risk_category = assessment.get('risk_category', '').lower()
        risk_percentage = assessment.get('risk_percentage', 0)
        
        if 'high' in risk_category or risk_percentage > 60:
            high_risk_diseases.append(disease)
        elif 'moderate' in risk_category or risk_percentage > 30:
            moderate_risk_diseases.append(disease)
    
    # General recommendations
    if high_risk_diseases:
        recommendations['immediate_actions'].extend([
            'Schedule urgent medical consultation',
            'Comprehensive health screening recommended'
        ])
        recommendations['medical_consultations'].extend([
            'Specialist consultation required',
            'Consider preventive medication'
        ])
    
    if moderate_risk_diseases or high_risk_diseases:
        recommendations['lifestyle_modifications'].extend([
            'Adopt heart-healthy diet',
            'Regular physical exercise (150+ minutes/week)',
            'Maintain healthy weight',
            'Quit smoking if applicable',
            'Limit alcohol consumption'
        ])
        recommendations['monitoring_schedule'].extend([
            'Regular health check-ups every 6 months',
            'Monitor blood pressure and glucose levels'
        ])
    
    # Disease-specific recommendations
    if 'diabetes' in high_risk_diseases or 'diabetes' in moderate_risk_diseases:
        recommendations['lifestyle_modifications'].append('Follow low-glycemic diet')
        recommendations['monitoring_schedule'].append('HbA1c testing every 3-6 months')
    
    if 'heart_disease' in high_risk_diseases or 'heart_disease' in moderate_risk_diseases:
        recommendations['medical_consultations'].append('Cardiology consultation')
        recommendations['monitoring_schedule'].append('Regular ECG and cardiac markers')
    
    return recommendations

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'message': 'The requested API endpoint does not exist'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500

if __name__ == '__main__':
    print("🏥 Chronic Disease Risk Assessment API Server")
    print("=" * 60)
    
    # Initialize system
    if initialize_system():
        print("\n📚 Available API Endpoints:")
        print("  GET  /api/health           - Health check")
        print("  GET  /api/models           - Get available models info")
        print("  POST /api/assess           - Assess single patient risk")
        print("  POST /api/assess-batch     - Assess multiple patients")
        print("  POST /api/upload-report    - Upload and process reports")
        print("  POST /api/full-assessment  - Complete workflow")
        print("\n🌐 Starting API server...")
        print("   Local:    http://localhost:5000")
        print("   Network:  http://0.0.0.0:5000")
        print("\n✅ Server ready for requests!")
        
        # Start Flask development server
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("❌ Failed to initialize system. Please check the setup.")
        sys.exit(1)
