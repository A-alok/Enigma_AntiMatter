import pandas as pd
import numpy as np
import requests
import json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class ChronicDiseasePredictor:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.label_encoders = {}
        self.feature_names = {}
        self.risk_thresholds = {
            'low': 0.3,
            'moderate': 0.6,
            'high': 0.8
        }
    
    def fetch_diabetes_dataset(self):
        """Fetch Pima Indians Diabetes Dataset"""
        try:
            url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
            columns = ['pregnancies', 'glucose', 'blood_pressure', 'skin_thickness', 
                      'insulin', 'bmi', 'diabetes_pedigree', 'age', 'outcome']
            
            df = pd.read_csv(url, names=columns)
            print(f"Diabetes dataset loaded: {df.shape}")
            return df
        except Exception as e:
            print(f"Error fetching diabetes dataset: {e}")
            return None
    
    def fetch_heart_disease_dataset(self):
        """Fetch Heart Disease Dataset"""
        try:
            url = "https://raw.githubusercontent.com/kk289/ML-Data-Science-Projects/master/Heart%20Disease%20Prediction/dataset.csv"
            df = pd.read_csv(url)
            print(f"Heart disease dataset loaded: {df.shape}")
            return df
        except Exception as e:
            print(f"Error fetching heart disease dataset: {e}")
            return None
    
    def fetch_kidney_disease_dataset(self):
        """Fetch Chronic Kidney Disease Dataset"""
        try:
            url = "https://raw.githubusercontent.com/mpuig/chronic-kidney-disease/master/data/chronic_kidney_disease.arff"
            # Note: This would need ARFF parsing - for now, we'll use a CSV version
            print("Kidney disease dataset - manual download required")
            return None
        except Exception as e:
            print(f"Error fetching kidney disease dataset: {e}")
            return None
    
    def preprocess_data(self, df, target_column, disease_type):
        """Preprocess the dataset"""
        # Handle missing values
        df = df.fillna(df.median())
        
        # Separate features and target
        X = df.drop(columns=[target_column])
        y = df[target_column]
        
        # Encode categorical variables
        categorical_columns = X.select_dtypes(include=['object']).columns
        le_dict = {}
        
        for col in categorical_columns:
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col])
            le_dict[col] = le
        
        self.label_encoders[disease_type] = le_dict
        
        # Scale numerical features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        X_scaled = pd.DataFrame(X_scaled, columns=X.columns)
        
        self.scalers[disease_type] = scaler
        self.feature_names[disease_type] = X.columns.tolist()
        
        return X_scaled, y
    
    def train_model(self, X, y, disease_type):
        """Train machine learning model"""
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Try multiple models and select the best one
        models = {
            'RandomForest': RandomForestClassifier(n_estimators=100, random_state=42),
            'GradientBoosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
        }
        
        best_model = None
        best_score = 0
        
        for name, model in models.items():
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            score = accuracy_score(y_test, y_pred)
            
            print(f"{name} Accuracy: {score:.4f}")
            
            if score > best_score:
                best_score = score
                best_model = model
        
        self.models[disease_type] = best_model
        
        # Print detailed results
        y_pred = best_model.predict(X_test)
        print(f"\nBest Model for {disease_type}:")
        print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
        print(f"AUC-ROC: {roc_auc_score(y_test, best_model.predict_proba(X_test)[:, 1]):.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        return best_model
    
    def analyze_feature_importance(self, disease_type):
        """Analyze feature importance"""
        if disease_type not in self.models:
            return
        
        model = self.models[disease_type]
        feature_names = self.feature_names[disease_type]
        
        # Get feature importance
        importance = model.feature_importances_
        feature_importance_df = pd.DataFrame({
            'feature': feature_names,
            'importance': importance
        }).sort_values('importance', ascending=False)
        
        print(f"\nFeature Importance for {disease_type}:")
        print(feature_importance_df)
        
        # Plot feature importance
        plt.figure(figsize=(10, 6))
        sns.barplot(data=feature_importance_df.head(10), x='importance', y='feature')
        plt.title(f'Top 10 Feature Importance - {disease_type}')
        plt.tight_layout()
        plt.savefig(f'feature_importance_{disease_type}.png')
        plt.show()
        
        return feature_importance_df
    
    def predict_risk_score(self, patient_data, disease_type):
        """Predict risk score for a patient"""
        if disease_type not in self.models:
            return None
        
        model = self.models[disease_type]
        scaler = self.scalers[disease_type]
        
        # Preprocess patient data
        patient_df = pd.DataFrame([patient_data])
        
        # Apply same preprocessing as training data
        for col, le in self.label_encoders[disease_type].items():
            if col in patient_df.columns:
                patient_df[col] = le.transform(patient_df[col])
        
        # Scale the data
        patient_scaled = scaler.transform(patient_df)
        
        # Get risk probability
        risk_prob = model.predict_proba(patient_scaled)[0][1]
        
        # Determine risk category
        if risk_prob < self.risk_thresholds['low']:
            risk_category = 'Low Risk'
        elif risk_prob < self.risk_thresholds['moderate']:
            risk_category = 'Moderate Risk'
        elif risk_prob < self.risk_thresholds['high']:
            risk_category = 'High Risk'
        else:
            risk_category = 'Very High Risk'
        
        return {
            'risk_score': risk_prob,
            'risk_category': risk_category,
            'risk_percentage': risk_prob * 100
        }
    
    def generate_report(self, patient_data, disease_types):
        """Generate comprehensive risk report"""
        report = {
            'patient_id': patient_data.get('patient_id', 'Unknown'),
            'assessment_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'risk_assessments': {}
        }
        
        for disease_type in disease_types:
            risk_result = self.predict_risk_score(patient_data, disease_type)
            if risk_result:
                report['risk_assessments'][disease_type] = risk_result
        
        return report
    
    def save_model(self, disease_type, filename=None):
        """Save trained model"""
        if filename is None:
            filename = f'chronic_disease_model_{disease_type}.pkl'
        
        import pickle
        
        model_data = {
            'model': self.models.get(disease_type),
            'scaler': self.scalers.get(disease_type),
            'label_encoders': self.label_encoders.get(disease_type),
            'feature_names': self.feature_names.get(disease_type)
        }
        
        with open(filename, 'wb') as f:
            pickle.dump(model_data, f)
        
        print(f"Model saved to {filename}")
    
    def load_model(self, filename, disease_type):
        """Load trained model"""
        import pickle
        
        try:
            with open(filename, 'rb') as f:
                model_data = pickle.load(f)
            
            self.models[disease_type] = model_data['model']
            self.scalers[disease_type] = model_data['scaler']
            self.label_encoders[disease_type] = model_data['label_encoders']
            self.feature_names[disease_type] = model_data['feature_names']
            
            print(f"Model loaded from {filename}")
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False

# Example usage
if __name__ == "__main__":
    # Initialize predictor
    predictor = ChronicDiseasePredictor()
    
    # Fetch and train on diabetes dataset
    print("Fetching diabetes dataset...")
    diabetes_df = predictor.fetch_diabetes_dataset()
    
    if diabetes_df is not None:
        print("Training diabetes model...")
        X, y = predictor.preprocess_data(diabetes_df, 'outcome', 'diabetes')
        predictor.train_model(X, y, 'diabetes')
        predictor.analyze_feature_importance('diabetes')
        predictor.save_model('diabetes')
        
        # Example prediction
        sample_patient = {
            'pregnancies': 2,
            'glucose': 120,
            'blood_pressure': 80,
            'skin_thickness': 20,
            'insulin': 100,
            'bmi': 25.5,
            'diabetes_pedigree': 0.5,
            'age': 35
        }
        
        risk_result = predictor.predict_risk_score(sample_patient, 'diabetes')
        print(f"\nSample Patient Risk Assessment:")
        print(f"Risk Score: {risk_result['risk_score']:.4f}")
        print(f"Risk Category: {risk_result['risk_category']}")
        print(f"Risk Percentage: {risk_result['risk_percentage']:.2f}%")
    
    print("Fetching heart disease dataset...")
    heart_df = predictor.fetch_heart_disease_dataset()
    
    if heart_df is not None:
        print("Training heart disease model...")
        # Assuming 'target' is the outcome column
        X, y = predictor.preprocess_data(heart_df, 'target', 'heart_disease')
        predictor.train_model(X, y, 'heart_disease')
        predictor.analyze_feature_importance('heart_disease')
        predictor.save_model('heart_disease')
