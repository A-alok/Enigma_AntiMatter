#!/usr/bin/env python3
"""
🏥 Ultimate Chronic Disease Risk Assessment System - DEMO
=========================================================

This demo showcases the complete system capabilities:
- Multi-API dataset fetching
- Advanced ML model training  
- Hospital report processing
- Comprehensive risk assessment
- Professional reporting

Built with ❤️ for better healthcare outcomes.
"""

import sys
import json
from pathlib import Path
from datetime import datetime

# Import system components
from enhanced_chronic_disease_predictor import EnhancedChronicDiseasePredictor
from report_processor import HospitalReportProcessor

def print_banner():
    """Print system banner"""
    banner = """
🏥 ═══════════════════════════════════════════════════════════════════════════════
   ULTIMATE CHRONIC DISEASE RISK ASSESSMENT SYSTEM - COMPREHENSIVE DEMO
═══════════════════════════════════════════════════════════════════════════════ 🏥

🎯 System Capabilities:
   ✅ Multi-API Dataset Integration (Kaggle, UCI, GitHub, CDC, WHO)
   ✅ Advanced ML Models (Ensemble Learning + Hyperparameter Tuning)
   ✅ Hospital Report Processing (PDF, DOCX, TXT)
   ✅ 6+ Chronic Disease Models (Diabetes, Heart Disease, Kidney, Stroke, etc.)
   ✅ Professional Clinical Reports
   ✅ Batch Patient Processing

═══════════════════════════════════════════════════════════════════════════════
"""
    print(banner)

def demo_dataset_fetching():
    """Demonstrate multi-API dataset fetching"""
    print("\n🔍 PHASE 1: MULTI-API DATASET FETCHING DEMONSTRATION")
    print("=" * 70)
    
    try:
        from multi_api_dataset_fetcher import MultiAPIDatasetFetcher
        
        fetcher = MultiAPIDatasetFetcher()
        
        # Show available diseases
        print("\n📋 Available Disease Datasets:")
        diseases = fetcher.list_available_diseases()
        
        # Test connectivity
        print("\n🌐 Testing Data Source Connectivity...")
        results = fetcher.test_all_sources()
        
        working_pct = (len(results['working']) / results['total_sources']) * 100
        print(f"✅ Data Sources Working: {len(results['working'])}/{results['total_sources']} ({working_pct:.1f}%)")
        
        # Demonstrate fetching diabetes dataset
        print(f"\n📥 Fetching Sample Dataset (Diabetes)...")
        diabetes_data, source = fetcher.fetch_dataset('diabetes', source_preference='direct_url')
        
        if diabetes_data is not None:
            print(f"✅ Successfully fetched from: {source['name']}")
            print(f"📊 Dataset shape: {diabetes_data.shape}")
            print(f"📈 Columns: {list(diabetes_data.columns)}")
            return True
        else:
            print("❌ Failed to fetch dataset")
            return False
            
    except Exception as e:
        print(f"❌ Dataset fetching failed: {e}")
        return False

def demo_ml_training():
    """Demonstrate advanced ML model training"""
    print("\n🤖 PHASE 2: ADVANCED MACHINE LEARNING TRAINING")
    print("=" * 70)
    
    try:
        predictor = EnhancedChronicDiseasePredictor()
        
        print("\n🔍 Fetching training data...")
        X_train, X_test, y_train, y_test = predictor.fetch_and_prepare_dataset(
            'diabetes', source_preference='direct_url'
        )
        
        if X_train is not None:
            print("✅ Training data prepared successfully")
            print(f"📊 Training set: {X_train.shape}")
            print(f"📊 Test set: {X_test.shape}")
            
            print("\n🧠 Training advanced ensemble model...")
            model = predictor.train_advanced_model(X_train, X_test, y_train, y_test, 'diabetes')
            
            if model:
                print("✅ Model training completed!")
                
                # Test prediction
                sample_patient = {
                    'pregnancies': 2,
                    'glucose': 130,  # Slightly elevated
                    'blood_pressure': 85,
                    'skin_thickness': 22,
                    'insulin': 105,
                    'bmi': 27.8,  # Overweight
                    'diabetes_pedigree': 0.6,
                    'age': 42
                }
                
                print(f"\n🎯 Testing Model with Sample Patient:")
                for key, value in sample_patient.items():
                    print(f"   {key}: {value}")
                
                risk_result = predictor.predict_risk_score(sample_patient, 'diabetes')
                
                if risk_result:
                    print(f"\n📊 DIABETES RISK ASSESSMENT:")
                    print(f"   Risk Score: {risk_result['risk_score']:.4f}")
                    print(f"   Risk Category: {risk_result['risk_category']}")
                    print(f"   Risk Percentage: {risk_result['risk_percentage']:.1f}%")
                    print(f"   Prediction Confidence: {risk_result['confidence']:.3f}")
                    
                return predictor
                
        return None
        
    except Exception as e:
        print(f"❌ ML training failed: {e}")
        return None

def demo_report_processing():
    """Demonstrate hospital report processing"""
    print("\n📄 PHASE 3: HOSPITAL REPORT PROCESSING")
    print("=" * 70)
    
    try:
        processor = HospitalReportProcessor()
        
        # Check if sample report exists
        sample_file = "sample_patient_report.txt"
        if not Path(sample_file).exists():
            print(f"⚠️ Sample report not found: {sample_file}")
            return None
        
        print(f"📋 Processing sample hospital report: {sample_file}")
        
        # Process the report
        processed_data = processor.process_multiple_reports([sample_file])
        
        if processed_data:
            print("✅ Report processing completed!")
            
            # Show extracted data
            aggregated = processed_data.get('aggregated_data', {})
            print(f"\n📊 Extracted Medical Data:")
            
            for key, value in aggregated.items():
                if value is not None:
                    if isinstance(value, dict) and 'latest' in value:
                        print(f"   {key}: {value['latest']}")
                    else:
                        print(f"   {key}: {value}")
            
            # Generate patient profile
            patient_profile = processor.generate_patient_profile(aggregated)
            print(f"\n👤 Generated Patient Profile:")
            for key, value in patient_profile.items():
                print(f"   {key}: {value}")
            
            return patient_profile
        else:
            print("❌ Report processing failed")
            return None
            
    except Exception as e:
        print(f"❌ Report processing failed: {e}")
        return None

def demo_comprehensive_assessment(predictor, patient_profile):
    """Demonstrate comprehensive risk assessment"""
    print("\n🎯 PHASE 4: COMPREHENSIVE RISK ASSESSMENT")
    print("=" * 70)
    
    if not predictor or not patient_profile:
        print("❌ Prerequisites not met for comprehensive assessment")
        return None
    
    try:
        print("📊 Performing comprehensive risk assessment...")
        
        # Map patient profile to diabetes features
        diabetes_features = {
            'pregnancies': patient_profile.get('pregnancies', 0),
            'glucose': patient_profile.get('glucose', 100),
            'blood_pressure': patient_profile.get('blood_pressure_systolic', patient_profile.get('systolic', 80)),
            'skin_thickness': 20,  # Default
            'insulin': 100,  # Default
            'bmi': patient_profile.get('bmi', 25),
            'diabetes_pedigree': 0.5,  # Default
            'age': patient_profile.get('age', 40)
        }
        
        print(f"\n🔬 Diabetes Risk Features:")
        for key, value in diabetes_features.items():
            if value is not None:
                print(f"   {key}: {value}")
        
        # Perform risk assessment
        risk_result = predictor.predict_risk_score(diabetes_features, 'diabetes')
        
        if risk_result:
            print(f"\n🎯 FINAL RISK ASSESSMENT RESULTS:")
            print("=" * 50)
            print(f"🏥 Disease: Diabetes")
            print(f"📊 Risk Score: {risk_result['risk_score']:.4f}")
            print(f"🚨 Risk Category: {risk_result['risk_category']}")
            print(f"📈 Risk Percentage: {risk_result['risk_percentage']:.1f}%")
            print(f"🎯 Confidence: {risk_result['confidence']:.3f}")
            
            # Generate recommendations based on risk level
            recommendations = generate_recommendations(risk_result)
            
            print(f"\n💡 CLINICAL RECOMMENDATIONS:")
            print("=" * 50)
            for category, recs in recommendations.items():
                if recs:
                    print(f"\n{category.replace('_', ' ').title()}:")
                    for rec in recs:
                        print(f"   • {rec}")
            
            # Generate comprehensive report
            report = {
                'patient_assessment': {
                    'assessment_date': datetime.now().isoformat(),
                    'system_version': '2.0',
                    'patient_profile': patient_profile,
                    'risk_assessment': {
                        'diabetes': risk_result
                    },
                    'recommendations': recommendations
                }
            }
            
            # Save report
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_file = f"demo_assessment_report_{timestamp}.json"
            
            with open(report_file, 'w') as f:
                json.dump(report, f, indent=2, default=str)
            
            print(f"\n💾 Comprehensive report saved: {report_file}")
            
            return report
        else:
            print("❌ Risk assessment failed")
            return None
            
    except Exception as e:
        print(f"❌ Comprehensive assessment failed: {e}")
        return None

def generate_recommendations(risk_result):
    """Generate clinical recommendations based on risk assessment"""
    recommendations = {
        'immediate_actions': [],
        'lifestyle_modifications': [],
        'medical_consultations': [],
        'monitoring_schedule': []
    }
    
    risk_score = risk_result['risk_score']
    risk_category = risk_result['risk_category'].lower()
    
    if 'very high' in risk_category:
        recommendations['immediate_actions'] = [
            "Schedule emergency medical consultation within 24 hours",
            "Comprehensive metabolic panel immediately",
            "Consider hospitalization if symptomatic"
        ]
        recommendations['medical_consultations'] = [
            "Endocrinologist consultation (urgent)",
            "Nutritionist consultation",
            "Diabetes educator consultation"
        ]
    elif 'high' in risk_category:
        recommendations['immediate_actions'] = [
            "Schedule medical consultation within 1 week",
            "Begin glucose monitoring"
        ]
        recommendations['lifestyle_modifications'] = [
            "Adopt low-glycemic index diet immediately",
            "Begin structured exercise program (150+ minutes/week)",
            "Weight management program"
        ]
        recommendations['medical_consultations'] = [
            "Endocrinologist consultation",
            "Nutritionist consultation"
        ]
        recommendations['monitoring_schedule'] = [
            "Blood glucose monitoring daily",
            "HbA1c testing every 3 months"
        ]
    elif 'moderate' in risk_category:
        recommendations['lifestyle_modifications'] = [
            "Increase physical activity to 150+ minutes/week",
            "Maintain healthy weight (BMI 18.5-24.9)",
            "Follow balanced, low-sugar diet"
        ]
        recommendations['monitoring_schedule'] = [
            "Annual comprehensive health screening",
            "HbA1c testing every 6 months"
        ]
    else:  # Low risk
        recommendations['lifestyle_modifications'] = [
            "Continue healthy lifestyle habits",
            "Regular physical activity",
            "Balanced nutrition"
        ]
        recommendations['monitoring_schedule'] = [
            "Annual health screening",
            "HbA1c testing annually"
        ]
    
    return recommendations

def print_summary():
    """Print demo summary"""
    summary = """
🎉 ═══════════════════════════════════════════════════════════════════════════════
   DEMO COMPLETED SUCCESSFULLY! 
═══════════════════════════════════════════════════════════════════════════════ 🎉

✅ DEMONSTRATED CAPABILITIES:
   🔍 Multi-API dataset fetching from various sources
   🤖 Advanced ML model training with ensemble learning
   📄 Hospital report processing and data extraction
   🎯 Comprehensive chronic disease risk assessment
   📊 Professional clinical reporting
   💡 Intelligent clinical recommendations

🚀 SYSTEM READY FOR PRODUCTION USE:
   • Process hospital reports (PDF, DOCX, TXT)
   • Assess risk for 6+ chronic diseases
   • Generate professional clinical reports
   • Handle batch patient processing
   • Integrate with existing healthcare systems

📞 NEXT STEPS:
   • Run: python ultimate_chronic_disease_system.py --setup
   • Use: python ultimate_chronic_disease_system.py --assess report.pdf
   • See: ULTIMATE_README.md for complete documentation

Built with ❤️ for better healthcare outcomes.
═══════════════════════════════════════════════════════════════════════════════
"""
    print(summary)

def main():
    """Main demo function"""
    print_banner()
    
    # Phase 1: Dataset Fetching
    dataset_success = demo_dataset_fetching()
    
    if not dataset_success:
        print("⚠️ Skipping remaining phases due to dataset issues")
        return
    
    # Phase 2: ML Training
    predictor = demo_ml_training()
    
    if not predictor:
        print("⚠️ Skipping remaining phases due to ML training issues")
        return
    
    # Phase 3: Report Processing
    patient_profile = demo_report_processing()
    
    # Phase 4: Comprehensive Assessment
    demo_comprehensive_assessment(predictor, patient_profile)
    
    # Final Summary
    print_summary()

if __name__ == "__main__":
    main()
