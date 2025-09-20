#!/usr/bin/env python3
"""
Comprehensive testing script for all trained chronic disease models
"""
from enhanced_chronic_disease_predictor import EnhancedChronicDiseasePredictor
import pandas as pd
import numpy as np

def test_all_models():
    """Test all trained models with sample data"""
    
    # Initialize predictor and load models
    print("🚀 Loading all trained models...")
    predictor = EnhancedChronicDiseasePredictor()
    
    models_loaded = 0
    try:
        predictor.load_model('enhanced_chronic_disease_model_diabetes.pkl', 'diabetes')
        models_loaded += 1
        print("✅ Diabetes model loaded")
    except Exception as e:
        print(f"❌ Failed to load diabetes model: {e}")

    try:
        predictor.load_model('enhanced_chronic_disease_model_heart_disease.pkl', 'heart_disease')
        models_loaded += 1
        print("✅ Heart disease model loaded")
    except Exception as e:
        print(f"❌ Failed to load heart disease model: {e}")

    try:
        predictor.load_model('enhanced_chronic_disease_model_kidney_disease.pkl', 'kidney_disease')
        models_loaded += 1
        print("✅ Kidney disease model loaded")
    except Exception as e:
        print(f"❌ Failed to load kidney disease model: {e}")

    try:
        predictor.load_model('enhanced_chronic_disease_model_stroke.pkl', 'stroke')
        models_loaded += 1
        print("✅ Stroke model loaded")
    except Exception as e:
        print(f"❌ Failed to load stroke model: {e}")

    try:
        predictor.load_model('enhanced_chronic_disease_model_hypertension.pkl', 'hypertension')
        models_loaded += 1
        print("✅ Hypertension model loaded")
    except Exception as e:
        print(f"❌ Failed to load hypertension model: {e}")

    try:
        predictor.load_model('enhanced_chronic_disease_model_copd.pkl', 'copd')
        models_loaded += 1
        print("✅ COPD model loaded")
    except Exception as e:
        print(f"❌ Failed to load COPD model: {e}")

    print(f"\n📊 Total models loaded: {models_loaded}/6")
    
    if models_loaded == 0:
        print("❌ No models loaded. Exiting test.")
        return
    
    print("\n🧪 TESTING INDIVIDUAL MODELS")
    print("="*50)

    # Test 1: Diabetes Model
    print("\n📊 Testing Diabetes Model:")
    diabetes_sample = {
        'pregnancies': 2, 'glucose': 125, 'blood_pressure': 85, 
        'skin_thickness': 20, 'insulin': 100, 'bmi': 27.8, 
        'diabetes_pedigree': 0.5, 'age': 45
    }

    try:
        result = predictor.predict_risk_score(diabetes_sample, 'diabetes')
        if result:
            print(f"  ✅ Risk: {result['risk_category']} ({result['risk_percentage']:.1f}%)")
            print(f"  📈 Risk Score: {result['risk_score']:.3f}")
        else:
            print("  ❌ Failed to predict")
    except Exception as e:
        print(f"  ❌ Error: {e}")

    # Test 2: Heart Disease Model
    print("\n❤️ Testing Heart Disease Model:")
    heart_sample = {
        'age': 45, 'sex': 1, 'cp': 2, 'trestbps': 140, 'chol': 240,
        'fbs': 1, 'restecg': 0, 'thalach': 85, 'exang': 0, 
        'oldpeak': 0, 'slope': 1, 'ca': 0, 'thal': 2
    }

    try:
        result = predictor.predict_risk_score(heart_sample, 'heart_disease')
        if result:
            print(f"  ✅ Risk: {result['risk_category']} ({result['risk_percentage']:.1f}%)")
            print(f"  📈 Risk Score: {result['risk_score']:.3f}")
        else:
            print("  ❌ Failed to predict")
    except Exception as e:
        print(f"  ❌ Error: {e}")

    # Test 3: Stroke Model  
    print("\n🧠 Testing Stroke Model:")
    stroke_sample = {
        'id': 1, 'gender': 'Male', 'age': 45, 'hypertension': 1,
        'heart_disease': 0, 'ever_married': 'Yes', 'work_type': 'Private',
        'Residence_type': 'Urban', 'avg_glucose_level': 125, 'bmi': 27.8,
        'smoking_status': 'formerly smoked'
    }

    try:
        result = predictor.predict_risk_score(stroke_sample, 'stroke')
        if result:
            print(f"  ✅ Risk: {result['risk_category']} ({result['risk_percentage']:.1f}%)")
            print(f"  📈 Risk Score: {result['risk_score']:.3f}")
        else:
            print("  ❌ Failed to predict")
    except Exception as e:
        print(f"  ❌ Error: {e}")

    # Test 4: Kidney Disease Model
    print("\n🫘 Testing Kidney Disease Model:")
    kidney_sample = {
        'age': 45, 'bp': 140, 'sg': 1.020, 'al': 1, 'su': 0, 
        'rbc': 'normal', 'pc': 'normal', 'pcc': 'notpresent', 
        'ba': 'notpresent', 'bgr': 125, 'bu': 40, 'sc': 1.3, 
        'sod': 142, 'pot': 4.2, 'hemo': 13.5, 'pcv': 40, 
        'wc': 8000, 'rc': 5.0, 'htn': 'yes', 'dm': 'no', 
        'cad': 'no', 'appet': 'good', 'pe': 'no', 'ane': 'no'
    }

    try:
        result = predictor.predict_risk_score(kidney_sample, 'kidney_disease')
        if result:
            print(f"  ✅ Risk: {result['risk_category']} ({result['risk_percentage']:.1f}%)")
            print(f"  📈 Risk Score: {result['risk_score']:.3f}")
        else:
            print("  ❌ Failed to predict")
    except Exception as e:
        print(f"  ❌ Error: {e}")

    # Test 5: Hypertension Model
    print("\n🩸 Testing Hypertension Model:")
    hypertension_sample = {
        'cp': 2, 'trestbps': 140, 'chol': 240, 'restecg': 0,
        'thalach': 85, 'exang': 0, 'oldpeak': 0, 'slope': 1,
        'ca': 0, 'thal': 2
    }

    try:
        result = predictor.predict_risk_score(hypertension_sample, 'hypertension')
        if result:
            print(f"  ✅ Risk: {result['risk_category']} ({result['risk_percentage']:.1f}%)")
            print(f"  📈 Risk Score: {result['risk_score']:.3f}")
        else:
            print("  ❌ Failed to predict")
    except Exception as e:
        print(f"  ❌ Error: {e}")

    # Test 6: COPD Model
    print("\n🫁 Testing COPD Model:")
    copd_sample = {
        'AGE': 45, 'PackHistory': 20, 'COPDSEVERITY': 'MODERATE',
        'MWT1': 350, 'MWT2': 360, 'MWT1Best': 360, 'FEV1': 1.8,
        'FEV1PRED': 75, 'FVC': 2.5, 'FVCPRED': 82, 'CAT': 15,
        'HAD': 10, 'SGRQ': 45, 'AGEquartiles': 2, 'gender': 1,
        'smoking': 2, 'Diabetes': 0, 'muscular': 0, 'hypertension': 1,
        'AtrialFib': 0, 'IHD': 0
    }

    try:
        result = predictor.predict_risk_score(copd_sample, 'copd')
        if result:
            print(f"  ✅ Risk: {result['risk_category']} ({result['risk_percentage']:.1f}%)")
            print(f"  📈 Risk Score: {result['risk_score']:.3f}")
        else:
            print("  ❌ Failed to predict")
    except Exception as e:
        print(f"  ❌ Error: {e}")

    print("\n" + "="*50)
    print("🎯 Model Testing Complete!")
    print(f"📊 Models successfully loaded: {models_loaded}/6")
    
    # Test feature information
    print("\n📋 Model Feature Information:")
    for disease in predictor.models.keys():
        if disease in predictor.feature_names:
            features = predictor.feature_names[disease]
            print(f"  {disease}: {len(features)} features - {features}")
        else:
            print(f"  {disease}: No feature information available")

if __name__ == "__main__":
    test_all_models()
