import os
import sys
import json
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Any

# Import our enhanced components
from multi_api_dataset_fetcher import MultiAPIDatasetFetcher
from enhanced_chronic_disease_predictor import EnhancedChronicDiseasePredictor
from report_processor import HospitalReportProcessor

class UltimateChronicDiseaseSystem:
    """
    Ultimate Chronic Disease Risk Assessment System
    
    Features:
    - Multi-API dataset fetching (Kaggle, UCI, GitHub, CDC, WHO)
    - Advanced ML models with ensemble learning
    - Hospital report processing (PDF, DOCX, TXT)
    - Comprehensive risk assessment
    - Professional reporting
    """
    
    def __init__(self):
        print("🚀 Initializing Ultimate Chronic Disease Risk Assessment System...")
        
        # Initialize components
        self.fetcher = MultiAPIDatasetFetcher()
        self.predictor = EnhancedChronicDiseasePredictor()
        self.report_processor = HospitalReportProcessor()
        
        # System configuration
        self.config = {
            'supported_diseases': [
                'diabetes', 'heart_disease', 'kidney_disease', 
                'stroke', 'hypertension', 'copd'
            ],
            'data_sources': ['kaggle', 'direct_url', 'cdc', 'who'],
            'file_formats': ['pdf', 'docx', 'txt'],
            'output_dir': Path('output'),
            'models_dir': Path('models'),
            'cache_dir': Path('dataset_cache')
        }
        
        # Create directories
        for dir_path in [self.config['output_dir'], self.config['models_dir'], self.config['cache_dir']]:
            dir_path.mkdir(exist_ok=True)
        
        print("✅ System initialized successfully!")
    
    def setup_system(self, source_preference='direct_url', train_all=True):
        """Complete system setup including dataset fetching and model training"""
        print("\n🔧 SYSTEM SETUP PHASE")
        print("=" * 60)
        
        # Test data source connectivity
        print("\n1️⃣ Testing Data Sources...")
        connectivity_results = self.fetcher.test_all_sources()
        
        working_sources = len(connectivity_results['working'])
        total_sources = connectivity_results['total_sources']
        print(f"Data sources available: {working_sources}/{total_sources}")
        
        if working_sources == 0:
            print("⚠️ No data sources available. Please check your internet connection.")
            return False
        
        # Train models
        if train_all:
            print("\n2️⃣ Training All Disease Models...")
            trained_models = self.predictor.train_all_diseases(source_preference=source_preference)
            print(f"Successfully trained {len(trained_models)} models")
        else:
            print("\n2️⃣ Skipping model training (use train_all=True to enable)")
        
        # Save system configuration
        config_file = self.config['output_dir'] / 'system_config.json'
        with open(config_file, 'w') as f:
            json.dump({
                'setup_date': datetime.now().isoformat(),
                'connectivity_results': connectivity_results,
                'trained_models': list(self.predictor.models.keys()),
                'config': {k: str(v) for k, v in self.config.items()}
            }, f, indent=2)
        
        print(f"\n✅ System setup completed! Configuration saved to {config_file}")
        return True
    
    def load_existing_models(self):
        """Load all existing trained models"""
        print("\n📥 Loading existing models...")
        
        models_dir = self.config['models_dir']
        model_files = list(models_dir.glob('enhanced_chronic_disease_model_*.pkl'))
        
        if not model_files:
            # Check current directory
            model_files = list(Path('.').glob('enhanced_chronic_disease_model_*.pkl'))
        
        loaded_count = 0
        for model_file in model_files:
            # Extract disease name from filename
            disease = model_file.stem.replace('enhanced_chronic_disease_model_', '')
            
            if self.predictor.load_model(str(model_file), disease):
                loaded_count += 1
        
        print(f"✅ Loaded {loaded_count} existing models")
        return loaded_count > 0
    
    def assess_patient_risk(self, patient_files: List[str], patient_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Complete patient risk assessment workflow
        
        Args:
            patient_files: List of hospital report file paths
            patient_id: Optional patient identifier
            
        Returns:
            Comprehensive risk assessment report
        """
        print(f"\n🏥 PATIENT RISK ASSESSMENT")
        print("=" * 60)
        
        if patient_id:
            print(f"Patient ID: {patient_id}")
        
        # Step 1: Process hospital reports
        print("\n📄 Step 1: Processing Hospital Reports...")
        processed_data = self.report_processor.process_multiple_reports(patient_files)
        
        if not processed_data or 'aggregated_data' not in processed_data:
            print("❌ Failed to process hospital reports")
            return None
        
        # Step 2: Extract patient profile
        print("\n👤 Step 2: Extracting Patient Profile...")
        patient_profile = self.report_processor.generate_patient_profile(processed_data['aggregated_data'])
        
        print(f"Extracted features: {list(patient_profile.keys())}")
        
        # Step 3: Perform risk assessments
        print("\n🎯 Step 3: Performing Risk Assessments...")
        risk_assessments = {}
        
        available_diseases = list(self.predictor.models.keys())
        if not available_diseases:
            print("❌ No trained models available")
            return None
        
        print(f"Available models: {available_diseases}")
        
        for disease in available_diseases:
            print(f"  Assessing {disease} risk...")
            
            # Map patient profile to disease-specific features
            disease_profile = self._map_patient_to_disease_features(patient_profile, disease)
            
            if disease_profile:
                risk_result = self.predictor.predict_risk_score(disease_profile, disease)
                if risk_result:
                    risk_assessments[disease] = risk_result
                    print(f"    ✅ {disease}: {risk_result['risk_category']} ({risk_result['risk_percentage']:.1f}%)")
                else:
                    print(f"    ❌ Failed to assess {disease}")
            else:
                print(f"    ⚠️ Insufficient data for {disease}")
        
        # Step 4: Generate comprehensive report
        print("\n📊 Step 4: Generating Comprehensive Report...")
        comprehensive_report = self._generate_comprehensive_report(
            patient_profile, risk_assessments, processed_data, patient_id
        )
        
        # Step 5: Save results
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        if patient_id:
            report_filename = f"risk_assessment_{patient_id}_{timestamp}.json"
        else:
            report_filename = f"risk_assessment_{timestamp}.json"
        
        report_path = self.config['output_dir'] / report_filename
        self._save_report(comprehensive_report, report_path)
        
        print(f"✅ Assessment completed! Report saved: {report_path}")
        
        # Step 6: Display summary
        self._display_risk_summary(comprehensive_report)
        
        return comprehensive_report
    
    def _map_patient_to_disease_features(self, patient_profile: Dict, disease: str) -> Dict:
        """Map patient profile to disease-specific features"""
        
        # Common feature mappings
        feature_maps = {
            'diabetes': {
                'pregnancies': patient_profile.get('pregnancies', 0),  # Default for males
                'glucose': patient_profile.get('glucose'),
                'blood_pressure': patient_profile.get('blood_pressure_systolic', patient_profile.get('systolic')),
                'skin_thickness': 20,  # Default
                'insulin': 100,  # Default
                'bmi': patient_profile.get('bmi'),
                'diabetes_pedigree': 0.5,  # Default
                'age': patient_profile.get('age')
            },
            'heart_disease': {
                'age': patient_profile.get('age'),
                'sex': 1 if patient_profile.get('gender') == 1 else 0,
                'cp': 2,  # Default chest pain type
                'trestbps': patient_profile.get('blood_pressure_systolic', patient_profile.get('systolic')),
                'chol': patient_profile.get('cholesterol'),
                'fbs': 1 if patient_profile.get('glucose', 0) > 120 else 0,
                'restecg': 0,  # Default
                'thalach': patient_profile.get('heart_rate', 150),
                'exang': 0,  # Default
                'oldpeak': 0,  # Default
                'slope': 1,  # Default
                'ca': 0,  # Default
                'thal': 2  # Default
            },
            'kidney_disease': {
                'age': patient_profile.get('age'),
                'bp': patient_profile.get('blood_pressure_systolic', patient_profile.get('systolic')),
                'sg': 1.020,  # Default specific gravity
                'al': 0,  # Default albumin
                'su': 0,  # Default sugar
                'rbc': 1,  # Default red blood cells
                'pc': 1,  # Default pus cell
                'pcc': 1,  # Default pus cell clumps
                'ba': 1,  # Default bacteria
                'bgr': patient_profile.get('glucose', 100),
                'bu': 40,  # Default blood urea
                'sc': patient_profile.get('creatinine', 1.2),
                'sod': 140,  # Default sodium
                'pot': 4.0,  # Default potassium
                'hemo': patient_profile.get('hemoglobin', 12),
                'pcv': 40,  # Default packed cell volume
                'wc': 8000,  # Default white blood cell count
                'rc': 5.0,  # Default red blood cell count
                'htn': 1 if patient_profile.get('blood_pressure_systolic', 0) > 140 else 0,
                'dm': 0,  # Default diabetes mellitus
                'cad': 0,  # Default coronary artery disease
                'appet': 1,  # Default appetite
                'pe': 0,  # Default pedal edema
                'ane': 0   # Default anemia
            }
        }
        
        if disease not in feature_maps:
            return {}
        
        # Filter out None values and ensure we have required features
        disease_features = {}
        for key, value in feature_maps[disease].items():
            if value is not None:
                disease_features[key] = value
        
        # Check if we have minimum required features
        if disease == 'diabetes':
            required = ['glucose', 'age']
            if not all(key in disease_features and disease_features[key] is not None for key in required):
                return {}
        elif disease == 'heart_disease':
            required = ['age']
            if not all(key in disease_features and disease_features[key] is not None for key in required):
                return {}
        
        return disease_features
    
    def _generate_comprehensive_report(self, patient_profile: Dict, risk_assessments: Dict, 
                                     processed_data: Dict, patient_id: Optional[str]) -> Dict:
        """Generate comprehensive risk assessment report"""
        
        report = {
            'metadata': {
                'report_type': 'Chronic Disease Risk Assessment',
                'system_version': '2.0',
                'generated_date': datetime.now().isoformat(),
                'patient_id': patient_id or 'Unknown',
                'reports_processed': processed_data.get('report_count', 0),
                'system_capabilities': {
                    'diseases_supported': len(self.config['supported_diseases']),
                    'data_sources': self.config['data_sources'],
                    'file_formats': self.config['file_formats']
                }
            },
            'patient_data': {
                'extracted_profile': patient_profile,
                'source_reports': [
                    report_data.get('source_file', 'Unknown') 
                    for report_data in processed_data.get('individual_reports', [])
                ],
                'extraction_quality': self._assess_extraction_quality(patient_profile)
            },
            'risk_assessments': risk_assessments,
            'clinical_insights': self._generate_clinical_insights(risk_assessments),
            'recommendations': self._generate_enhanced_recommendations(risk_assessments, patient_profile),
            'follow_up_plan': self._generate_follow_up_plan(risk_assessments),
            'risk_summary': self._generate_risk_summary(risk_assessments)
        }
        
        return report
    
    def _assess_extraction_quality(self, patient_profile: Dict) -> Dict:
        """Assess the quality of data extraction from reports"""
        total_possible_fields = 15  # Number of key medical fields
        extracted_fields = len([v for v in patient_profile.values() if v is not None])
        
        quality_score = extracted_fields / total_possible_fields
        
        if quality_score >= 0.8:
            quality_level = 'Excellent'
        elif quality_score >= 0.6:
            quality_level = 'Good'
        elif quality_score >= 0.4:
            quality_level = 'Fair'
        else:
            quality_level = 'Poor'
        
        return {
            'score': quality_score,
            'level': quality_level,
            'extracted_fields': extracted_fields,
            'total_possible': total_possible_fields,
            'missing_key_data': [
                field for field in ['age', 'glucose', 'blood_pressure_systolic', 'bmi']
                if field not in patient_profile or patient_profile[field] is None
            ]
        }
    
    def _generate_clinical_insights(self, risk_assessments: Dict) -> List[str]:
        """Generate clinical insights based on risk patterns"""
        insights = []
        
        if not risk_assessments:
            return ["Insufficient data for clinical insights"]
        
        # Overall risk pattern
        high_risk_diseases = [
            disease for disease, assessment in risk_assessments.items()
            if 'high' in assessment['risk_category'].lower()
        ]
        
        if len(high_risk_diseases) >= 2:
            insights.append(
                f"Multiple high-risk conditions detected ({', '.join(high_risk_diseases)}). "
                "This suggests a pattern of metabolic syndrome or cardiovascular risk clustering."
            )
        
        # Specific disease insights
        if 'diabetes' in risk_assessments and 'heart_disease' in risk_assessments:
            diabetes_risk = risk_assessments['diabetes']['risk_score']
            heart_risk = risk_assessments['heart_disease']['risk_score']
            
            if diabetes_risk > 0.6 and heart_risk > 0.6:
                insights.append(
                    "Elevated risk for both diabetes and heart disease detected. "
                    "These conditions often co-occur and compound cardiovascular risk."
                )
        
        # Risk score analysis
        risk_scores = [assessment['risk_score'] for assessment in risk_assessments.values()]
        avg_risk = sum(risk_scores) / len(risk_scores)
        
        if avg_risk > 0.7:
            insights.append(
                f"Average risk score is high ({avg_risk:.2f}). "
                "Immediate medical attention and lifestyle interventions strongly recommended."
            )
        elif avg_risk > 0.4:
            insights.append(
                f"Moderate overall risk profile detected (average: {avg_risk:.2f}). "
                "Preventive measures and regular monitoring advised."
            )
        
        return insights
    
    def _generate_enhanced_recommendations(self, risk_assessments: Dict, patient_profile: Dict) -> Dict:
        """Generate enhanced recommendations based on comprehensive analysis"""
        recommendations = {
            'immediate_actions': [],
            'lifestyle_modifications': [],
            'medical_consultations': [],
            'monitoring_schedule': [],
            'preventive_measures': []
        }
        
        # Immediate actions based on high-risk conditions
        high_risk_diseases = [
            disease for disease, assessment in risk_assessments.items()
            if assessment['risk_score'] > 0.75
        ]
        
        if high_risk_diseases:
            recommendations['immediate_actions'].append(
                f"Schedule urgent medical consultation for high-risk conditions: {', '.join(high_risk_diseases)}"
            )
        
        # Disease-specific recommendations
        for disease, assessment in risk_assessments.items():
            risk_level = assessment['risk_category'].lower()
            
            if 'diabetes' in disease and 'moderate' in risk_level or 'high' in risk_level:
                recommendations['lifestyle_modifications'].extend([
                    "Adopt low-glycemic index diet",
                    "Implement structured exercise program (150+ minutes/week)",
                    "Monitor blood glucose regularly"
                ])
                recommendations['medical_consultations'].append("Endocrinologist consultation")
                recommendations['monitoring_schedule'].append("HbA1c every 3 months")
            
            elif 'heart_disease' in disease and ('moderate' in risk_level or 'high' in risk_level):
                recommendations['lifestyle_modifications'].extend([
                    "Heart-healthy diet (DASH or Mediterranean)",
                    "Aerobic exercise 30+ minutes daily",
                    "Stress management techniques"
                ])
                recommendations['medical_consultations'].append("Cardiologist consultation")
                recommendations['monitoring_schedule'].append("Lipid profile every 6 months")
            
            elif 'kidney_disease' in disease and ('moderate' in risk_level or 'high' in risk_level):
                recommendations['lifestyle_modifications'].extend([
                    "Reduce sodium intake (<2300mg/day)",
                    "Maintain adequate hydration",
                    "Protein restriction if advised by physician"
                ])
                recommendations['medical_consultations'].append("Nephrologist consultation")
                recommendations['monitoring_schedule'].append("Kidney function tests quarterly")
        
        # Preventive measures based on patient profile
        age = patient_profile.get('age', 0)
        if age > 50:
            recommendations['preventive_measures'].extend([
                "Annual comprehensive health screening",
                "Bone density screening",
                "Age-appropriate cancer screenings"
            ])
        
        # Remove duplicates
        for category in recommendations:
            recommendations[category] = list(set(recommendations[category]))
        
        return recommendations
    
    def _generate_follow_up_plan(self, risk_assessments: Dict) -> Dict:
        """Generate structured follow-up plan"""
        plan = {
            '1_week': [],
            '1_month': [],
            '3_months': [],
            '6_months': [],
            '1_year': []
        }
        
        max_risk = max([assessment['risk_score'] for assessment in risk_assessments.values()] + [0])
        
        if max_risk > 0.8:
            plan['1_week'].append("Emergency medical consultation")
            plan['1_month'].append("Specialist appointments")
            plan['3_months'].append("Comprehensive health reassessment")
        elif max_risk > 0.6:
            plan['1_month'].append("Primary care physician consultation")
            plan['3_months'].append("Risk factor reassessment")
            plan['6_months'].append("Lifestyle intervention review")
        else:
            plan['6_months'].append("Routine health check-up")
            plan['1_year'].append("Comprehensive health screening")
        
        return plan
    
    def _generate_risk_summary(self, risk_assessments: Dict) -> Dict:
        """Generate executive risk summary"""
        if not risk_assessments:
            return {'overall_risk': 'Unknown', 'priority': 'Low', 'action_required': 'Data collection'}
        
        risk_scores = [assessment['risk_score'] for assessment in risk_assessments.values()]
        avg_risk = sum(risk_scores) / len(risk_scores)
        max_risk = max(risk_scores)
        
        # Determine overall risk level
        if max_risk >= 0.8:
            overall_risk = 'Very High'
            priority = 'Urgent'
            action_required = 'Immediate medical intervention'
        elif max_risk >= 0.6:
            overall_risk = 'High'
            priority = 'High'
            action_required = 'Medical consultation within 1 month'
        elif avg_risk >= 0.4:
            overall_risk = 'Moderate'
            priority = 'Medium'
            action_required = 'Lifestyle modifications and monitoring'
        else:
            overall_risk = 'Low'
            priority = 'Low'
            action_required = 'Continue healthy lifestyle'
        
        return {
            'overall_risk': overall_risk,
            'priority': priority,
            'action_required': action_required,
            'max_risk_score': max_risk,
            'average_risk_score': avg_risk,
            'diseases_assessed': len(risk_assessments),
            'high_risk_conditions': len([
                d for d, a in risk_assessments.items() 
                if a['risk_score'] > 0.6
            ])
        }
    
    def _save_report(self, report: Dict, file_path: Path):
        """Save report to file"""
        try:
            with open(file_path, 'w') as f:
                json.dump(report, f, indent=2, default=str)
            return True
        except Exception as e:
            print(f"❌ Error saving report: {e}")
            return False
    
    def _display_risk_summary(self, report: Dict):
        """Display formatted risk summary"""
        print("\n" + "=" * 80)
        print("🏥 CHRONIC DISEASE RISK ASSESSMENT SUMMARY")
        print("=" * 80)
        
        metadata = report['metadata']
        risk_summary = report['risk_summary']
        
        print(f"\n📋 Patient: {metadata['patient_id']}")
        print(f"📅 Assessment Date: {metadata['generated_date']}")
        print(f"📄 Reports Processed: {metadata['reports_processed']}")
        
        print(f"\n🎯 OVERALL RISK ASSESSMENT")
        print(f"Risk Level: {risk_summary['overall_risk']}")
        print(f"Priority: {risk_summary['priority']}")
        print(f"Action Required: {risk_summary['action_required']}")
        print(f"Max Risk Score: {risk_summary['max_risk_score']:.1%}")
        print(f"Average Risk Score: {risk_summary['average_risk_score']:.1%}")
        
        print(f"\n📊 DISEASE-SPECIFIC ASSESSMENTS")
        for disease, assessment in report['risk_assessments'].items():
            print(f"  {disease.replace('_', ' ').title():<20}: {assessment['risk_category']:<15} ({assessment['risk_percentage']:>5.1f}%)")
        
        print(f"\n💡 TOP RECOMMENDATIONS")
        recommendations = report['recommendations']
        if recommendations['immediate_actions']:
            print("  Immediate Actions:")
            for action in recommendations['immediate_actions'][:3]:
                print(f"    • {action}")
        
        if recommendations['lifestyle_modifications']:
            print("  Lifestyle Modifications:")
            for mod in recommendations['lifestyle_modifications'][:3]:
                print(f"    • {mod}")
        
        print(f"\n🔍 CLINICAL INSIGHTS")
        for insight in report['clinical_insights'][:2]:
            print(f"  • {insight}")
        
        print("\n" + "=" * 80)
    
    def batch_assess_patients(self, patient_data_dir: str, output_dir: Optional[str] = None):
        """Batch process multiple patients"""
        print(f"\n📁 BATCH PATIENT ASSESSMENT")
        print("=" * 60)
        
        patient_dir = Path(patient_data_dir)
        if not patient_dir.exists():
            print(f"❌ Patient data directory not found: {patient_data_dir}")
            return
        
        # Find patient folders (assuming each patient has their own subfolder)
        patient_folders = [d for d in patient_dir.iterdir() if d.is_dir()]
        
        if not patient_folders:
            print("❌ No patient folders found")
            return
        
        print(f"Found {len(patient_folders)} patient folders")
        
        results = {}
        for i, patient_folder in enumerate(patient_folders, 1):
            patient_id = patient_folder.name
            print(f"\n[{i}/{len(patient_folders)}] Processing Patient: {patient_id}")
            
            # Find report files
            report_files = []
            for ext in ['*.pdf', '*.docx', '*.txt']:
                report_files.extend(patient_folder.glob(ext))
            
            if report_files:
                report_files = [str(f) for f in report_files]
                result = self.assess_patient_risk(report_files, patient_id)
                results[patient_id] = result
            else:
                print(f"  ⚠️ No report files found for {patient_id}")
        
        # Generate batch summary
        self._generate_batch_summary(results, output_dir or self.config['output_dir'])
        return results
    
    def _generate_batch_summary(self, results: Dict, output_dir: Path):
        """Generate summary report for batch processing"""
        summary = {
            'batch_metadata': {
                'processed_date': datetime.now().isoformat(),
                'total_patients': len(results),
                'successful_assessments': len([r for r in results.values() if r is not None])
            },
            'risk_distribution': {},
            'high_risk_patients': [],
            'recommendations_summary': {}
        }
        
        # Analyze risk distribution
        risk_levels = {'Low Risk': 0, 'Moderate Risk': 0, 'High Risk': 0, 'Very High Risk': 0}
        
        for patient_id, result in results.items():
            if result and 'risk_summary' in result:
                overall_risk = result['risk_summary']['overall_risk']
                if overall_risk in risk_levels:
                    risk_levels[overall_risk] += 1
                
                # Track high-risk patients
                if 'high' in overall_risk.lower():
                    summary['high_risk_patients'].append({
                        'patient_id': patient_id,
                        'risk_level': overall_risk,
                        'max_risk_score': result['risk_summary']['max_risk_score'],
                        'conditions': list(result['risk_assessments'].keys())
                    })
        
        summary['risk_distribution'] = risk_levels
        
        # Save batch summary
        summary_file = output_dir / f"batch_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(summary_file, 'w') as f:
            json.dump(summary, f, indent=2, default=str)
        
        print(f"\n📊 Batch Summary:")
        print(f"Total Patients: {summary['batch_metadata']['total_patients']}")
        print(f"Successful Assessments: {summary['batch_metadata']['successful_assessments']}")
        print(f"High Risk Patients: {len(summary['high_risk_patients'])}")
        print(f"Summary saved: {summary_file}")
    
    def get_system_status(self):
        """Get comprehensive system status"""
        print("\n🔧 SYSTEM STATUS")
        print("=" * 50)
        
        # Data sources status
        connectivity = self.fetcher.test_all_sources()
        print(f"Data Sources: {len(connectivity['working'])}/{connectivity['total_sources']} working")
        
        # Models status
        available_models = list(self.predictor.models.keys())
        print(f"Trained Models: {len(available_models)}")
        if available_models:
            print(f"  Available: {', '.join(available_models)}")
        
        # System capabilities
        print(f"Supported Diseases: {len(self.config['supported_diseases'])}")
        print(f"File Formats: {', '.join(self.config['file_formats'])}")
        
        return {
            'data_sources': connectivity,
            'models': available_models,
            'system_ready': len(available_models) > 0 and len(connectivity['working']) > 0
        }

def main():
    """Main CLI interface"""
    parser = argparse.ArgumentParser(description='Ultimate Chronic Disease Risk Assessment System')
    parser.add_argument('--setup', action='store_true', help='Setup system and train models')
    parser.add_argument('--assess', nargs='+', help='Assess risk for patient report files')
    parser.add_argument('--patient-id', help='Patient identifier')
    parser.add_argument('--batch', help='Batch process patients in directory')
    parser.add_argument('--status', action='store_true', help='Show system status')
    parser.add_argument('--source', default='direct_url', choices=['kaggle', 'direct_url', 'cdc', 'who'], 
                       help='Preferred data source')
    
    args = parser.parse_args()
    
    # Initialize system
    system = UltimateChronicDiseaseSystem()
    
    if args.setup:
        print("🚀 Setting up system...")
        system.setup_system(source_preference=args.source, train_all=True)
    
    elif args.assess:
        # Load existing models first
        if not system.load_existing_models():
            print("⚠️ No trained models found. Run with --setup first.")
            return
        
        # Assess patient risk
        result = system.assess_patient_risk(args.assess, args.patient_id)
        if not result:
            print("❌ Assessment failed")
    
    elif args.batch:
        # Load existing models first
        if not system.load_existing_models():
            print("⚠️ No trained models found. Run with --setup first.")
            return
        
        # Batch process
        system.batch_assess_patients(args.batch)
    
    elif args.status:
        status = system.get_system_status()
        if status['system_ready']:
            print("✅ System ready for assessments")
        else:
            print("⚠️ System not ready. Run --setup first")
    
    else:
        # Interactive mode
        print("\n🏥 Ultimate Chronic Disease Risk Assessment System")
        print("Interactive Mode - Choose an option:")
        print("1. Setup system and train models")
        print("2. Assess patient risk")
        print("3. Check system status")
        print("4. Exit")
        
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == '1':
            system.setup_system()
        elif choice == '2':
            if not system.load_existing_models():
                print("⚠️ No trained models found. Please setup system first.")
                return
            
            files = input("Enter report file paths (comma-separated): ").strip().split(',')
            files = [f.strip() for f in files if f.strip()]
            
            if files:
                patient_id = input("Patient ID (optional): ").strip() or None
                system.assess_patient_risk(files, patient_id)
        elif choice == '3':
            system.get_system_status()
        elif choice == '4':
            print("👋 Goodbye!")
        else:
            print("❌ Invalid choice")

if __name__ == "__main__":
    main()
