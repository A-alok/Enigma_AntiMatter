# Chronic Disease Risk Assessment System

A comprehensive machine learning system for predicting chronic disease risk based on patient medical reports and hospital records. This system can analyze uploaded hospital reports (PDF, DOCX, TXT) and provide risk assessments for diabetes, heart disease, and other chronic conditions.

## 🎯 Features

- **Multi-format Report Processing**: Supports PDF, DOCX, and TXT hospital reports
- **Automated Data Extraction**: Extracts medical values, lab results, and patient information from reports
- **Machine Learning Predictions**: Uses trained models for chronic disease risk assessment
- **Comprehensive Risk Scoring**: Provides risk scores, categories, and personalized recommendations
- **Multiple Disease Models**: Currently supports diabetes and heart disease prediction
- **Professional Reports**: Generates detailed JSON reports with recommendations

## 📊 Datasets Used

### 1. **Pima Indians Diabetes Dataset**
- **Source**: UCI Machine Learning Repository
- **Features**: Pregnancies, Glucose, Blood Pressure, Skin Thickness, Insulin, BMI, Diabetes Pedigree Function, Age
- **Target**: Diabetes Outcome (0/1)
- **Size**: 768 records
- **API**: `https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv`

### 2. **Heart Disease Dataset (Cleveland)**
- **Source**: UCI Machine Learning Repository  
- **Features**: Age, Sex, Chest Pain Type, Resting Blood Pressure, Cholesterol, Fasting Blood Sugar, etc.
- **Target**: Heart Disease Presence (0/1)
- **Size**: 303 records
- **API**: Available through GitHub repositories

### 3. **Additional Datasets** (Available for expansion)
- **BRFSS (Behavioral Risk Factor Surveillance System)** - CDC
- **NHANES (National Health and Nutrition Examination Survey)** - CDC
- **Chronic Kidney Disease Dataset** - UCI
- **Stroke Prediction Dataset** - Kaggle

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Required Packages
- pandas >= 1.5.0
- numpy >= 1.21.0
- scikit-learn >= 1.1.0
- matplotlib >= 3.5.0
- seaborn >= 0.11.0
- requests >= 2.28.0
- PyPDF2 >= 2.12.0
- python-docx >= 0.8.11

## 📁 File Structure

```
Enigma/
├── chronic_disease_predictor.py      # Main ML model class
├── report_processor.py               # Hospital report processing
├── integrated_risk_assessment.py     # Complete integrated system
├── requirements.txt                  # Package dependencies
├── README.md                        # Documentation
├── sample_patient_report.txt        # Sample report for testing
├── chronic_disease_model_diabetes.pkl # Trained diabetes model
└── output/                          # Generated reports and data
    ├── processed_patient_data_*.json
    └── chronic_disease_risk_report_*.json
```

## 💻 Usage

### Quick Start

1. **Run the integrated system:**
```bash
python integrated_risk_assessment.py
```

This will:
- Download and train models (first run only)
- Process sample patient report
- Generate risk assessment
- Save comprehensive report

### Custom Patient Reports

2. **Process your own reports:**

```python
from integrated_risk_assessment import IntegratedRiskAssessment

# Initialize system
system = IntegratedRiskAssessment()

# Process your hospital reports
patient_files = [
    "path/to/patient_report.pdf",
    "path/to/lab_results.docx", 
    "path/to/discharge_summary.txt"
]

# Get risk assessment
result = system.process_patient_reports(patient_files)
if result:
    patient_profile, processed_data = result
    risk_assessments = system.assess_risk(patient_profile)
    
    # Generate report
    report = system.generate_comprehensive_report(
        patient_profile, risk_assessments, processed_data
    )
    system.print_summary(report)
```

### Individual Components

3. **Use specific components:**

```python
# Just process reports
from report_processor import HospitalReportProcessor

processor = HospitalReportProcessor()
processed_data = processor.process_multiple_reports(["report.pdf"])
```

```python
# Just predict risk
from chronic_disease_predictor import ChronicDiseasePredictor

predictor = ChronicDiseasePredictor()
predictor.load_model('chronic_disease_model_diabetes.pkl', 'diabetes')

sample_patient = {
    'glucose': 120,
    'age': 45,
    'bmi': 28.5,
    # ... other features
}

risk = predictor.predict_risk_score(sample_patient, 'diabetes')
print(f"Risk: {risk['risk_percentage']:.1f}%")
```

## 📋 Input Requirements

### Supported File Formats
- **PDF**: Medical reports, lab results, discharge summaries
- **DOCX**: Hospital documents, medical records
- **TXT**: Plain text medical reports

### Expected Medical Data
The system can extract:
- **Vital Signs**: Blood pressure, heart rate, BMI
- **Lab Results**: Glucose, HbA1c, cholesterol, creatinine
- **Patient Info**: Age, gender, medical history
- **Symptoms**: Chest pain, fatigue, breathing issues

### Sample Report Format
```
PATIENT MEDICAL REPORT

Patient: John Doe
Age: 45 years
Gender: Male
Date: 2024-01-15

VITAL SIGNS:
Blood Pressure: 140/90 mmHg
Heart Rate: 85 bpm
BMI: 28.5

LABORATORY RESULTS:
Fasting Glucose: 126 mg/dl
HbA1c: 6.2%
Total Cholesterol: 240 mg/dl
HDL Cholesterol: 35 mg/dl
```

## 📈 Model Performance

### Diabetes Prediction Model
- **Algorithm**: Gradient Boosting Classifier
- **Accuracy**: 74.7%
- **AUC-ROC**: 81.0%
- **Features**: 8 clinical parameters
- **Training Data**: 768 patients

### Risk Categories
- **Low Risk**: 0-30% probability
- **Moderate Risk**: 30-60% probability  
- **High Risk**: 60-80% probability
- **Very High Risk**: 80-100% probability

## 📊 Output Format

### Risk Assessment Report
```json
{
  "assessment_metadata": {
    "assessment_date": "2025-01-20T10:30:00",
    "patient_id": "Unknown",
    "reports_processed": 1
  },
  "patient_profile": {
    "age": 45.0,
    "glucose": 126.0,
    "bmi": 28.5,
    "blood_pressure_systolic": 140.0
  },
  "risk_assessments": {
    "diabetes": {
      "risk_score": 0.642,
      "risk_category": "High Risk", 
      "risk_percentage": 64.2
    }
  },
  "recommendations": {
    "lifestyle": [
      "Adopt a low-glycemic diet",
      "Regular physical exercise (150 min/week)"
    ],
    "medical_consultation": ["Consult endocrinologist"]
  }
}
```

## 🔧 API Integration

### Adding New Datasets

To integrate additional datasets:

1. **Add fetch method** in `ChronicDiseasePredictor`:
```python
def fetch_new_disease_dataset(self):
    url = "your_dataset_api_endpoint"
    df = pd.read_csv(url)
    return df
```

2. **Add disease mapping** in `IntegratedRiskAssessment`:
```python
def map_profile_to_disease(self, patient_profile, disease):
    if disease == 'new_disease':
        # Map patient features to model features
        return mapped_features
```

### Using External APIs

Example with CDC BRFSS API:
```python
def fetch_brfss_data(self):
    api_key = "your_api_key"
    url = f"https://chronicdata.cdc.gov/api/views/waxm-p5qv/rows.json?$limit=10000"
    response = requests.get(url)
    return response.json()
```

## 🏥 Clinical Applications

### Use Cases
1. **Primary Care Screening**: Early detection of chronic disease risk
2. **Preventive Medicine**: Lifestyle intervention recommendations
3. **Population Health**: Risk stratification for health programs
4. **Insurance Assessment**: Risk-based premium calculations
5. **Research Studies**: Large-scale epidemiological analysis

### Medical Validation
- System provides risk estimates only
- Not a substitute for professional medical diagnosis
- Recommendations should be reviewed by healthcare providers
- Regular model validation with clinical outcomes required

## ⚠️ Limitations & Disclaimers

1. **Medical Disclaimer**: This system is for research and educational purposes only
2. **Not FDA Approved**: Not approved for clinical diagnosis or treatment decisions
3. **Data Quality**: Results depend on quality and completeness of input reports
4. **Model Limitations**: Based on historical data, may not reflect individual cases
5. **Professional Consultation**: Always consult healthcare professionals for medical decisions

## 🔮 Future Enhancements

### Planned Features
- **Additional Diseases**: Kidney disease, stroke, COPD prediction models
- **Deep Learning**: Neural networks for complex pattern recognition
- **Real-time APIs**: Direct integration with EHR systems
- **Mobile App**: Patient-facing mobile application
- **Longitudinal Analysis**: Trend analysis over time
- **Multi-language Support**: Process reports in multiple languages

### Dataset Expansion
- **MIMIC-III**: ICU patient data
- **UK Biobank**: Large-scale genetic and health data  
- **WHO Global Health Observatory**: International health statistics
- **Local Hospital Data**: Institution-specific training data

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-disease-model`)
3. Commit changes (`git commit -am 'Add new disease prediction model'`)
4. Push to branch (`git push origin feature/new-disease-model`)
5. Create Pull Request

### Development Guidelines
- Follow PEP 8 style guidelines
- Add unit tests for new features
- Update documentation for API changes
- Validate medical accuracy with healthcare professionals

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions, suggestions, or collaborations:
- **Email**: your.email@domain.com
- **GitHub Issues**: Create an issue for bugs or feature requests
- **Healthcare Partnerships**: Contact for clinical validation studies

## 🏆 Acknowledgments

- **UCI Machine Learning Repository**: For providing high-quality datasets
- **CDC**: For public health data and APIs
- **Scikit-learn Community**: For excellent machine learning tools
- **Healthcare Professionals**: For clinical insights and validation

---

**⚡ Quick Test**: Run `python integrated_risk_assessment.py` to see the system in action with sample data!
