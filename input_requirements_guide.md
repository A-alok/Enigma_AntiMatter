# 🏥 ULTIMATE CHRONIC DISEASE SYSTEM - INPUT REQUIREMENTS GUIDE

## 📋 **FIRST-TIME PATIENT REGISTRATION**

### **Required Basic Information:**
```
👤 Personal Details:
- Age (years)
- Gender (Male/Female)
- Patient ID (alphanumeric)

📊 Vital Signs:
- Blood Pressure (Systolic/Diastolic in mmHg)
- Heart Rate (BPM)
- BMI or (Weight in kg + Height)

🩸 Blood Tests:
- Glucose Level (mg/dl or mmol/l)
- Cholesterol Levels (Total, HDL, LDL in mg/dl)
- HbA1c (%)
```

### **Disease-Specific Additional Requirements:**

#### **🫀 HEART DISEASE:**
```json
{
  "age": 45,
  "sex": 1,
  "cp": 2,
  "trestbps": 130,
  "chol": 250,
  "fbs": 1,
  "restecg": 0,
  "thalach": 150,
  "exang": 0,
  "oldpeak": 1.0,
  "slope": 1,
  "ca": 0,
  "thal": 2
}
```

#### **📊 DIABETES:**
```json
{
  "pregnancies": 2,
  "glucose": 120,
  "blood_pressure": 80,
  "skin_thickness": 25,
  "insulin": 80,
  "bmi": 28.5,
  "diabetes_pedigree_function": 0.5,
  "age": 35
}
```

#### **🧠 STROKE:**
```json
{
  "gender": "Male",
  "age": 65,
  "hypertension": 1,
  "heart_disease": 0,
  "ever_married": "Yes",
  "work_type": "Private",
  "residence_type": "Urban",
  "avg_glucose_level": 110,
  "bmi": 27.5,
  "smoking_status": "formerly smoked"
}
```

#### **🩸 HYPERTENSION:**
```json
{
  "age": 50,
  "sex": 1,
  "cp": 1,
  "trestbps": 140,
  "chol": 220,
  "restecg": 0,
  "thalach": 160,
  "exang": 0,
  "oldpeak": 0.5,
  "slope": 1
}
```

#### **🫘 KIDNEY DISEASE:**
```json
{
  "age": 55,
  "bp": 80,
  "sg": 1.020,
  "al": 2,
  "su": 1,
  "rbc": "normal",
  "pc": "normal",
  "pcc": "notpresent",
  "ba": "notpresent",
  "bgr": 120,
  "bu": 30,
  "sc": 1.2,
  "sod": 140,
  "pot": 4.0,
  "hemo": 12.0,
  "pcv": 40,
  "wc": 8000,
  "rc": 4.5,
  "htn": "yes",
  "dm": "no",
  "cad": "no",
  "appet": "good",
  "pe": "no",
  "ane": "no"
}
```

#### **🫁 COPD:**
```json
{
  "age": 60,
  "smoking_history": "Yes",
  "pack_years": 20,
  "dyspnea_grade": 2,
  "fev1_percent": 65,
  "copd_severity": "moderate"
}
```

---

## 📅 **DAILY MONITORING INPUTS**

### **Essential Daily Vitals:**
```
📊 Morning Readings:
- Blood Pressure: [Systolic/Diastolic] mmHg
- Heart Rate: [BPM]
- Weight: [kg]
- Fasting Glucose: [mg/dl] (if diabetic)

🌡️ Symptoms Tracking:
- Chest Pain: [0-10 scale]
- Shortness of Breath: [0-10 scale]
- Fatigue Level: [0-10 scale]
- Energy Level: [0-10 scale]

💊 Medications:
- Medication Name: [text]
- Dosage: [amount]
- Time Taken: [HH:MM]
- Compliance: [Yes/No]
```

### **Weekly Monitoring:**
```
📈 Weekly Averages:
- Average Blood Pressure
- Average Heart Rate
- Weight Change
- Sleep Quality (1-10)
- Exercise Minutes
- Stress Level (1-10)
```

---

## 🏥 **MEDICAL REPORT PROCESSING**

### **Supported File Formats:**
- **PDF** (.pdf)
- **Word Documents** (.docx, .doc)
- **Text Files** (.txt)

### **Required Medical Report Content:**

#### **🩺 Lab Results:**
```
Blood Chemistry:
- Glucose: [value] mg/dl
- HbA1c: [value] %
- Total Cholesterol: [value] mg/dl
- HDL Cholesterol: [value] mg/dl
- LDL Cholesterol: [value] mg/dl
- Triglycerides: [value] mg/dl
- Creatinine: [value] mg/dl
- BUN/Urea: [value] mg/dl

Complete Blood Count:
- Hemoglobin: [value] g/dl
- White Blood Cells: [value] /μl
- Red Blood Cells: [value] million/μl
- Platelet Count: [value] /μl
```

#### **📋 Clinical Examination:**
```
Vital Signs:
- Blood Pressure: [Systolic/Diastolic] mmHg
- Heart Rate: [value] BPM
- Temperature: [value] °F/°C
- Respiratory Rate: [value] /min
- BMI: [value] kg/m²

Physical Examination:
- Heart Sounds: [Normal/Abnormal]
- Lung Sounds: [Clear/Abnormal]
- Edema: [Present/Absent]
- Pulse Quality: [Strong/Weak/Irregular]
```

#### **🔍 Diagnostic Tests:**
```
ECG/EKG Results:
- Rhythm: [Regular/Irregular]
- Heart Rate: [BPM]
- ST Changes: [Present/Absent]
- T-wave Changes: [Present/Absent]

Chest X-Ray:
- Heart Size: [Normal/Enlarged]
- Lung Fields: [Clear/Abnormal]
- Pleural Effusion: [Present/Absent]

Echocardiogram (if available):
- Ejection Fraction: [value] %
- Wall Motion: [Normal/Abnormal]
- Valve Function: [Normal/Abnormal]
```

---

## 📊 **HISTORICAL DATA INPUTS**

### **Past Medical History:**
```
🏥 Previous Diagnoses:
- Diabetes: [Yes/No] - Year diagnosed: [YYYY]
- Hypertension: [Yes/No] - Year diagnosed: [YYYY]
- Heart Disease: [Yes/No] - Type: [text]
- Kidney Disease: [Yes/No] - Stage: [1-5]
- Stroke: [Yes/No] - Date: [DD/MM/YYYY]
- COPD: [Yes/No] - Severity: [Mild/Moderate/Severe]

🧬 Family History:
- Family Member: [Mother/Father/Sibling]
- Condition: [Disease name]
- Age at Diagnosis: [years]

💊 Medication History:
- Current Medications: [List with dosages]
- Previous Medications: [List with duration]
- Allergies: [List of drug allergies]
- Adverse Reactions: [Any known reactions]
```

### **Lifestyle History:**
```
🚬 Smoking History:
- Current Smoker: [Yes/No]
- Pack Years: [number]
- Quit Date: [DD/MM/YYYY] (if applicable)

🍺 Alcohol Consumption:
- Current Drinker: [Yes/No]
- Drinks per Week: [number]
- Type: [Beer/Wine/Spirits]

🏃 Exercise History:
- Regular Exercise: [Yes/No]
- Type: [Cardio/Strength/Mixed]
- Frequency: [days per week]
- Duration: [minutes per session]
```

---

## 🔄 **SYSTEM USAGE EXAMPLES**

### **First Time Registration:**
```bash
python ultimate_chronic_disease_system.py --register --patient-id P001 --file patient_registration.pdf
```

### **Daily Monitoring:**
```bash
python ultimate_chronic_disease_system.py --monitor --patient-id P001 --vitals daily_vitals.txt
```

### **Medical Report Processing:**
```bash
python ultimate_chronic_disease_system.py --assess lab_results.pdf --patient-id P001
```

### **Batch Processing:**
```bash
python ultimate_chronic_disease_system.py --batch /path/to/patient/reports/ --output-dir results/
```

---

## 📝 **SAMPLE INPUT FILES**

### **Patient Registration (registration.txt):**
```
Patient ID: P001
Name: John Doe
Age: 45 years
Gender: Male
Weight: 85 kg
Height: 175 cm
Blood Pressure: 130/80 mmHg
Heart Rate: 72 BPM
Fasting Glucose: 110 mg/dl
Total Cholesterol: 200 mg/dl
HDL: 45 mg/dl
LDL: 130 mg/dl
```

### **Daily Vitals (daily_vitals.txt):**
```
Date: 2025-09-20
Time: 08:00 AM
Blood Pressure: 125/78 mmHg
Heart Rate: 68 BPM
Weight: 84.5 kg
Fasting Glucose: 105 mg/dl
Symptoms: None
Medication: Metformin 500mg taken
Exercise: 30 minutes walking
Sleep: 7 hours
```

### **Lab Report (lab_results.txt):**
```
LABORATORY RESULTS
Patient: John Doe (P001)
Date: September 20, 2025

BLOOD CHEMISTRY:
Glucose (Fasting): 108 mg/dl
HbA1c: 5.8%
Total Cholesterol: 195 mg/dl
HDL Cholesterol: 48 mg/dl
LDL Cholesterol: 125 mg/dl
Triglycerides: 150 mg/dl
Creatinine: 1.0 mg/dl
BUN: 15 mg/dl

COMPLETE BLOOD COUNT:
Hemoglobin: 14.2 g/dl
WBC: 7500 /μl
RBC: 4.5 million/μl
Platelets: 250000 /μl

VITAL SIGNS:
Blood Pressure: 128/82 mmHg
Heart Rate: 70 BPM
BMI: 27.8 kg/m²
```

---

## ⚡ **QUICK START COMMANDS**

### **System Status:**
```bash
python ultimate_chronic_disease_system.py --status
```

### **Train Models:**
```bash
python enhanced_chronic_disease_predictor.py
```

### **Process Single Report:**
```bash
python ultimate_chronic_disease_system.py --assess patient_report.pdf --patient-id P001
```

### **Interactive Mode:**
```bash
python ultimate_chronic_disease_system.py --interactive
```

---

## 🎯 **SUMMARY**

The system requires:
1. **First Registration**: Basic demographics + comprehensive medical data
2. **Daily Monitoring**: Vital signs + symptoms + medications  
3. **Medical Reports**: Lab results + clinical exams + diagnostic tests
4. **Historical Data**: Past medical history + family history + lifestyle

The system automatically extracts relevant features from medical reports and maps them to the appropriate disease prediction models for comprehensive risk assessment.
