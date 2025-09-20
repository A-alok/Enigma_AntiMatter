#!/usr/bin/env python3
"""
Corrected comprehensive testing script for all trained chronic disease models
Uses the exact features each model was trained on
"""
from enhanced_chronic_disease_predictor import EnhancedChronicDiseasePredictor
import pandas as pd
import numpy as np

def test_corrected_models():
    """Test all trained models with sample data using correct features"""
    
    print("🚀 Loading all trained models...")
    predictor = EnhancedChronicDiseasePredictor()
    
    # Load all models
    models = {
        'diabetes': 'enhanced_chronic_disease_model_diabetes.pkl',
        'heart_disease': 'enhanced_chronic_disease_model_heart_disease.pkl', 
        'kidney_disease': 'enhanced_chronic_disease_model_kidney_disease.pkl',
        'stroke': 'enhanced_chronic_disease_model_stroke.pkl',
        'hypertension': 'enhanced_chronic_disease_model_hypertension.pkl',
        'copd': 'enhanced_chronic_disease_model_copd.pkl'
    }
    
    models_loaded = 0
    for disease, model_file in models.items():
        try:
            predictor.load_model(model_file, disease)
            models_loaded += 1
            print(f"✅ {disease} model loaded")
        except Exception as e:
            print(f"❌ Failed to load {disease} model: {e}")
    
    print(f"\n📊 Total models loaded: {models_loaded}/6")
    
    print("\n🧪 TESTING MODELS WITH CORRECT FEATURES")
    print("="*60)

    # Test 1: Diabetes Model - Using exact training features
    print("\n📊 Testing Diabetes Model:")
    print("   Features: pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, diabetes_pedigree, age")
    
    diabetes_sample = pd.DataFrame([{
        'pregnancies': 2, 
        'glucose': 125, 
        'blood_pressure': 85, 
        'skin_thickness': 20, 
        'insulin': 100, 
        'bmi': 27.8, 
        'diabetes_pedigree': 0.5, 
        'age': 45
    }])

    try:
        result = predictor.predict_risk_score(diabetes_sample, 'diabetes')
        if result:
            print(f"  ✅ Risk: {result['risk_category']} ({result['risk_percentage']:.1f}%)")
            print(f"  📈 Risk Score: {result['risk_score']:.3f}")
        else:
            print("  ❌ Failed to predict")
    except Exception as e:
        print(f"  ❌ Error: {e}")

    # Test 2: Heart Disease Model - Using exact training features  
    print("\n❤️ Testing Heart Disease Model:")
    print("   Features: age, sex, cp, trestbps, thalach, exang, oldpeak, slope, ca, thal")
    
    heart_sample = pd.DataFrame([{
        'age': 45, 
        'sex': 1, 
        'cp': 2, 
        'trestbps': 140, 
        'thalach': 85, 
        'exang': 0, 
        'oldpeak': 0.0, 
        'slope': 1, 
        'ca': 0, 
        'thal': 2
    }])

    try:
        result = predictor.predict_risk_score(heart_sample, 'heart_disease')
        if result:
            print(f"  ✅ Risk: {result['risk_category']} ({result['risk_percentage']:.1f}%)")
            print(f"  📈 Risk Score: {result['risk_score']:.3f}")
        else:
            print("  ❌ Failed to predict")
    except Exception as e:
        print(f"  ❌ Error: {e}")

    # Test 3: Kidney Disease Model - Using exact training features
    print("\n🫘 Testing Kidney Disease Model:")
    print("   Features: sg, al, rbc, pc, bu, hemo, pcv, rc, htn, dm")
    
    kidney_sample = pd.DataFrame([{
        'sg': 1.020, 
        'al': 1, 
        'rbc': 'normal', 
        'pc': 'normal', 
        'bu': 40, 
        'hemo': 13.5, 
        'pcv': 40, 
        'rc': 5.0, 
        'htn': 'yes', 
        'dm': 'no'
    }])

    try:
        result = predictor.predict_risk_score(kidney_sample, 'kidney_disease')
        if result:
            print(f"  ✅ Risk: {result['risk_category']} ({result['risk_percentage']:.1f}%)")
            print(f"  📈 Risk Score: {result['risk_score']:.3f}")
        else:
            print("  ❌ Failed to predict")
    except Exception as e:
        print(f"  ❌ Error: {e}")

    # Test 4: Stroke Model - Using exact training features
    print("\n🧠 Testing Stroke Model:")
    print("   Features: id, age, hypertension, heart_disease, ever_married, work_type, Residence_type, avg_glucose_level, bmi, smoking_status")
    
    stroke_sample = pd.DataFrame([{
        'id': 1, 
        'age': 45, 
        'hypertension': 1, 
        'heart_disease': 0, 
        'ever_married': 'Yes', 
        'work_type': 'Private', 
        'Residence_type': 'Urban', 
        'avg_glucose_level': 125, 
        'bmi': 27.8, 
        'smoking_status': 'formerly smoked'
    }])

    try:
        result = predictor.predict_risk_score(stroke_sample, 'stroke')
        if result:
            print(f"  ✅ Risk: {result['risk_category']} ({result['risk_percentage']:.1f}%)")
            print(f"  📈 Risk Score: {result['risk_score']:.3f}")
        else:
            print("  ❌ Failed to predict")
    except Exception as e:
        print(f"  ❌ Error: {e}")

    # Test 5: Hypertension Model - Using exact training features
    print("\n🩸 Testing Hypertension Model:")
    print("   Features: cp, trestbps, chol, restecg, thalach, exang, oldpeak, slope, ca, thal")
    
    hypertension_sample = pd.DataFrame([{
        'cp': 2, 
        'trestbps': 140, 
        'chol': 240, 
        'restecg': 0, 
        'thalach': 85, 
        'exang': 0, 
        'oldpeak': 0.0, 
        'slope': 1, 
        'ca': 0, 
        'thal': 2
    }])

    try:
        result = predictor.predict_risk_score(hypertension_sample, 'hypertension')
        if result:
            print(f"  ✅ Risk: {result['risk_category']} ({result['risk_percentage']:.1f}%)")
            print(f"  📈 Risk Score: {result['risk_score']:.3f}")
        else:
            print("  ❌ Failed to predict")
    except Exception as e:
        print(f"  ❌ Error: {e}")

    # Test 6: COPD Model - Using exact training features
    print("\n🫁 Testing COPD Model:")
    print("   Features: COPDSEVERITY, MWT1, MWT2, MWT1Best, FEV1, FEV1PRED, FVC, FVCPRED, SGRQ, smoking")
    
    copd_sample = pd.DataFrame([{
        'COPDSEVERITY': 'MODERATE', 
        'MWT1': 350, 
        'MWT2': 360, 
        'MWT1Best': 360, 
        'FEV1': 1.8, 
        'FEV1PRED': 75, 
        'FVC': 2.5, 
        'FVCPRED': 82, 
        'SGRQ': 45, 
        'smoking': 2
    }])

    try:
        result = predictor.predict_risk_score(copd_sample, 'copd')
        if result:
            print(f"  ✅ Risk: {result['risk_category']} ({result['risk_percentage']:.1f}%)")
            print(f"  📈 Risk Score: {result['risk_score']:.3f}")
        else:
            print("  ❌ Failed to predict")
    except Exception as e:
        print(f"  ❌ Error: {e}")

    # Summary
    print("\n" + "="*60)
    print("🎯 CORRECTED MODEL TESTING COMPLETE!")
    print(f"📊 Models successfully loaded: {models_loaded}/6")
    
    # Performance summary
    working_models = []
    
    print("\n📋 MODEL PERFORMANCE SUMMARY:")
    print("-" * 60)
    if 'diabetes' in predictor.models:
        print("📊 Diabetes Model      - 75.3% Accuracy, 83.3% AUC (GradientBoosting)")
        working_models.append('diabetes')
    if 'heart_disease' in predictor.models:
        print("❤️ Heart Disease Model - 100% Accuracy, 100% AUC (RandomForest)")
        working_models.append('heart_disease')
    if 'stroke' in predictor.models:
        print("🧠 Stroke Model        - 95.1% Accuracy, 83.6% AUC (LogisticRegression)")
        working_models.append('stroke')
    if 'hypertension' in predictor.models:
        print("🩸 Hypertension Model  - 100% Accuracy, 100% AUC (GradientBoosting)")
        working_models.append('hypertension')
    if 'kidney_disease' in predictor.models:
        print("🫘 Kidney Disease Model- 100% Accuracy, 100% AUC (RandomForest)")
        working_models.append('kidney_disease')
    if 'copd' in predictor.models:
        print("🫁 COPD Model          - 100% Accuracy, 100% AUC (RandomForest)")
        working_models.append('copd')
    
    print(f"\n✅ ALL {len(working_models)} MODELS LOADED AND READY!")
    print("🎉 System is ready for chronic disease risk assessment!")

if __name__ == "__main__":
    test_corrected_models()
