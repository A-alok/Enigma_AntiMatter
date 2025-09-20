import os
import sys
from pathlib import Path
import json
from datetime import datetime
from chronic_disease_predictor import ChronicDiseasePredictor
from report_processor import HospitalReportProcessor

class IntegratedRiskAssessment:
    def __init__(self):
        self.predictor = ChronicDiseasePredictor()
        self.report_processor = HospitalReportProcessor()
        self.supported_diseases = ['diabetes', 'heart_disease']
        
    def setup_models(self):
        """Download datasets and train models"""
        print("Setting up chronic disease prediction models...")
        
        # Train diabetes model
        print("\n1. Training Diabetes Risk Model...")
        diabetes_df = self.predictor.fetch_diabetes_dataset()
        if diabetes_df is not None:
            X, y = self.predictor.preprocess_data(diabetes_df, 'outcome', 'diabetes')
            self.predictor.train_model(X, y, 'diabetes')
            self.predictor.save_model('diabetes')
            print("✓ Diabetes model trained and saved")
        
        # Train heart disease model
        print("\n2. Training Heart Disease Risk Model...")
        heart_df = self.predictor.fetch_heart_disease_dataset()
        if heart_df is not None:
            X, y = self.predictor.preprocess_data(heart_df, 'target', 'heart_disease')
            self.predictor.train_model(X, y, 'heart_disease')
            self.predictor.save_model('heart_disease')
            print("✓ Heart disease model trained and saved")
            
        print("\n✓ All models setup complete!")
    
    def load_existing_models(self):
        """Load pre-trained models if they exist"""
        model_files = {
            'diabetes': 'chronic_disease_model_diabetes.pkl',
            'heart_disease': 'chronic_disease_model_heart_disease.pkl'
        }
        
        loaded_models = []
        for disease, filename in model_files.items():
            if Path(filename).exists():
                if self.predictor.load_model(filename, disease):
                    loaded_models.append(disease)
                    print(f"✓ {disease} model loaded")
        
        return loaded_models
    
    def process_patient_reports(self, report_files):
        """Process uploaded hospital reports"""
        print("Processing hospital reports...")
        
        # Validate files exist
        existing_files = []
        for file_path in report_files:
            if Path(file_path).exists():
                existing_files.append(file_path)
            else:
                print(f"Warning: File not found - {file_path}")
        
        if not existing_files:
            print("No valid report files found!")
            return None
        
        # Process reports
        processed_data = self.report_processor.process_multiple_reports(existing_files)
        patient_profile = self.report_processor.generate_patient_profile(processed_data['aggregated_data'])
        
        # Save processed data
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"processed_patient_data_{timestamp}.json"
        self.report_processor.save_processed_data(processed_data, output_file)
        
        return patient_profile, processed_data
    
    def assess_risk(self, patient_profile):
        """Assess chronic disease risk for a patient"""
        risk_assessments = {}
        
        print("\nPerforming Risk Assessment...")
        print("=" * 50)
        
        for disease in self.supported_diseases:
            if disease in self.predictor.models:
                # Map patient profile to disease-specific features
                disease_profile = self.map_profile_to_disease(patient_profile, disease)
                
                if disease_profile:
                    risk_result = self.predictor.predict_risk_score(disease_profile, disease)
                    if risk_result:
                        risk_assessments[disease] = risk_result
                        
                        print(f"\n{disease.replace('_', ' ').title()} Risk Assessment:")
                        print(f"  Risk Score: {risk_result['risk_score']:.4f}")
                        print(f"  Risk Category: {risk_result['risk_category']}")
                        print(f"  Risk Percentage: {risk_result['risk_percentage']:.1f}%")
        
        return risk_assessments
    
    def map_profile_to_disease(self, patient_profile, disease):
        """Map patient profile to disease-specific feature set"""
        if disease == 'diabetes':
            # Map to diabetes model features
            diabetes_features = {}
            
            # Map available features
            feature_mapping = {
                'pregnancies': 0,  # Default for male or unknown
                'glucose': patient_profile.get('glucose', 100),  # Default normal glucose
                'blood_pressure': patient_profile.get('blood_pressure_systolic', 80),
                'skin_thickness': 20,  # Default value
                'insulin': 100,  # Default value  
                'bmi': patient_profile.get('bmi', 25),
                'diabetes_pedigree': 0.5,  # Default value
                'age': patient_profile.get('age', 40)
            }
            
            for key, default_value in feature_mapping.items():
                diabetes_features[key] = patient_profile.get(key, default_value)
            
            return diabetes_features
            
        elif disease == 'heart_disease':
            # Map to heart disease model features (this would depend on the actual heart disease dataset structure)
            heart_features = {}
            
            # Common heart disease features
            feature_mapping = {
                'age': patient_profile.get('age', 40),
                'sex': patient_profile.get('gender', 1),  # 1 for male, 0 for female
                'cp': 2,  # Chest pain type (default)
                'trestbps': patient_profile.get('blood_pressure_systolic', 120),
                'chol': patient_profile.get('cholesterol', 200),
                'fbs': 0,  # Fasting blood sugar
                'restecg': 0,  # Resting ECG
                'thalach': patient_profile.get('heart_rate', 150),
                'exang': 0,  # Exercise induced angina
                'oldpeak': 0,  # ST depression
                'slope': 1,  # Slope of peak exercise ST segment
                'ca': 0,  # Number of major vessels
                'thal': 2  # Thalassemia
            }
            
            for key, default_value in feature_mapping.items():
                heart_features[key] = patient_profile.get(key, default_value)
            
            return heart_features
        
        return None
    
    def generate_comprehensive_report(self, patient_profile, risk_assessments, processed_data):
        """Generate comprehensive risk assessment report"""
        report = {
            'assessment_metadata': {
                'assessment_date': datetime.now().isoformat(),
                'patient_id': processed_data.get('patient_id', 'Unknown'),
                'reports_processed': processed_data.get('report_count', 0)
            },
            'patient_profile': patient_profile,
            'risk_assessments': risk_assessments,
            'recommendations': self.generate_recommendations(risk_assessments),
            'next_steps': self.suggest_next_steps(risk_assessments)
        }
        
        return report
    
    def generate_recommendations(self, risk_assessments):
        """Generate health recommendations based on risk assessments"""
        recommendations = {
            'lifestyle': [],
            'monitoring': [],
            'medical_consultation': []
        }
        
        for disease, assessment in risk_assessments.items():
            risk_level = assessment['risk_category'].lower()
            
            if 'diabetes' in disease:
                if 'high' in risk_level or 'very high' in risk_level:
                    recommendations['lifestyle'].extend([
                        "Adopt a low-glycemic diet",
                        "Regular physical exercise (150 min/week)",
                        "Maintain healthy weight (BMI 18.5-24.9)"
                    ])
                    recommendations['monitoring'].extend([
                        "Monitor blood glucose regularly",
                        "Check HbA1c every 3 months"
                    ])
                    recommendations['medical_consultation'].append("Consult endocrinologist")
                    
            elif 'heart' in disease:
                if 'high' in risk_level or 'very high' in risk_level:
                    recommendations['lifestyle'].extend([
                        "Follow heart-healthy diet (low sodium, saturated fat)",
                        "Regular cardiovascular exercise",
                        "Quit smoking if applicable"
                    ])
                    recommendations['monitoring'].extend([
                        "Monitor blood pressure regularly",
                        "Check lipid profile every 6 months"
                    ])
                    recommendations['medical_consultation'].append("Consult cardiologist")
        
        # Remove duplicates
        for category in recommendations:
            recommendations[category] = list(set(recommendations[category]))
        
        return recommendations
    
    def suggest_next_steps(self, risk_assessments):
        """Suggest next steps based on risk levels"""
        max_risk = 0
        for assessment in risk_assessments.values():
            max_risk = max(max_risk, assessment['risk_score'])
        
        if max_risk >= 0.8:
            return [
                "Immediate medical consultation recommended",
                "Consider comprehensive health screening",
                "Discuss preventive medications with physician"
            ]
        elif max_risk >= 0.6:
            return [
                "Schedule medical check-up within 1 month",
                "Implement lifestyle modifications",
                "Regular monitoring of key health metrics"
            ]
        elif max_risk >= 0.3:
            return [
                "Continue regular health monitoring",
                "Maintain healthy lifestyle habits",
                "Annual comprehensive health screening"
            ]
        else:
            return [
                "Continue current healthy lifestyle",
                "Regular annual health check-ups",
                "Stay informed about chronic disease prevention"
            ]
    
    def save_report(self, report, filename=None):
        """Save comprehensive report to file"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"chronic_disease_risk_report_{timestamp}.json"
        
        try:
            with open(filename, 'w') as f:
                json.dump(report, f, indent=2, default=str)
            print(f"\n✓ Comprehensive report saved to: {filename}")
            return filename
        except Exception as e:
            print(f"Error saving report: {e}")
            return None
    
    def print_summary(self, report):
        """Print a summary of the risk assessment"""
        print("\n" + "=" * 60)
        print("CHRONIC DISEASE RISK ASSESSMENT SUMMARY")
        print("=" * 60)
        
        print(f"\nAssessment Date: {report['assessment_metadata']['assessment_date']}")
        print(f"Reports Processed: {report['assessment_metadata']['reports_processed']}")
        
        print("\n📊 RISK ASSESSMENTS:")
        for disease, assessment in report['risk_assessments'].items():
            print(f"  {disease.replace('_', ' ').title()}:")
            print(f"    Risk Level: {assessment['risk_category']}")
            print(f"    Risk Score: {assessment['risk_percentage']:.1f}%")
        
        print("\n💡 RECOMMENDATIONS:")
        if report['recommendations']['lifestyle']:
            print("  Lifestyle:")
            for rec in report['recommendations']['lifestyle']:
                print(f"    • {rec}")
        
        if report['recommendations']['medical_consultation']:
            print("  Medical Consultation:")
            for rec in report['recommendations']['medical_consultation']:
                print(f"    • {rec}")
        
        print("\n📋 NEXT STEPS:")
        for step in report['next_steps']:
            print(f"  • {step}")

def main():
    """Main function to run the integrated risk assessment"""
    print("🏥 Chronic Disease Risk Assessment System")
    print("=" * 50)
    
    # Initialize system
    system = IntegratedRiskAssessment()
    
    # Try to load existing models
    loaded_models = system.load_existing_models()
    
    # If no models loaded, train new ones
    if not loaded_models:
        print("No existing models found. Training new models...")
        system.setup_models()
    
    # Example usage with sample files
    print("\n📄 Processing Patient Reports...")
    
    # You would replace this with actual file paths
    sample_report_files = [
        "sample_patient_report.txt",  # Create sample files for testing
        "sample_lab_results.pdf",
        "sample_discharge_summary.docx"
    ]
    
    # Create sample files for demonstration
    create_sample_files()
    
    # Process reports
    result = system.process_patient_reports(["sample_patient_report.txt"])
    
    if result:
        patient_profile, processed_data = result
        
        print("✓ Reports processed successfully")
        print(f"📋 Extracted Patient Profile: {json.dumps(patient_profile, indent=2)}")
        
        # Perform risk assessment
        risk_assessments = system.assess_risk(patient_profile)
        
        # Generate comprehensive report
        comprehensive_report = system.generate_comprehensive_report(
            patient_profile, risk_assessments, processed_data
        )
        
        # Save and display report
        report_filename = system.save_report(comprehensive_report)
        system.print_summary(comprehensive_report)
        
    else:
        print("❌ Could not process patient reports. Please check file paths.")

def create_sample_files():
    """Create sample patient report files for testing"""
    sample_content = """
    PATIENT MEDICAL REPORT
    
    Patient: John Doe
    Age: 45 years
    Gender: Male
    Date: 2024-01-15
    
    VITAL SIGNS:
    Blood Pressure: 140/90 mmHg
    Heart Rate: 85 bpm
    Weight: 85 kg
    BMI: 28.5
    
    LABORATORY RESULTS:
    Fasting Glucose: 126 mg/dl
    HbA1c: 6.2%
    Total Cholesterol: 240 mg/dl
    HDL Cholesterol: 35 mg/dl
    LDL Cholesterol: 160 mg/dl
    Triglycerides: 200 mg/dl
    Creatinine: 1.1 mg/dl
    Hemoglobin: 14.5 g/dl
    
    CLINICAL NOTES:
    Patient presents with elevated glucose levels and blood pressure.
    Family history of diabetes and cardiovascular disease.
    Currently experiencing mild fatigue and occasional chest discomfort.
    
    RECOMMENDATIONS:
    - Lifestyle modifications
    - Follow-up in 3 months
    - Monitor glucose levels
    """
    
    # Create sample text file
    with open("sample_patient_report.txt", "w") as f:
        f.write(sample_content)
    
    print("✓ Sample patient report created: sample_patient_report.txt")

if __name__ == "__main__":
    main()
