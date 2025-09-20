# 🏥 VitalCircle Clinical Test Credentials

## PROTOTYPE ONLY - Hardcoded Credentials

**⚠️ Important**: These are hardcoded credentials for prototype demonstration only. In a production environment, proper authentication with encrypted passwords and secure authentication providers should be used.

---

## 📋 Available Clinical Test Accounts

### 1. **Dr. Emily Chen** - Endocrinologist
- **Email**: `dr.emily.chen@citymedical.com`
- **Password**: `clinical123`
- **License**: `MD-12345`
- **Specialty**: Endocrinology
- **Department**: Endocrinology & Diabetes
- **Hospital**: City Medical Center

### 2. **Dr. Sarah Wilson** - Cardiologist
- **Email**: `dr.sarah.wilson@citymedical.com`
- **Password**: `clinical456`
- **License**: `MD-67890`
- **Specialty**: Cardiology
- **Department**: Cardiovascular Medicine
- **Hospital**: City Medical Center

### 3. **Dr. Michael Brown** - Internal Medicine
- **Email**: `dr.michael.brown@citymedical.com`
- **Password**: `clinical789`
- **License**: `MD-11223`
- **Specialty**: Internal Medicine
- **Department**: Internal Medicine
- **Hospital**: City Medical Center

### 4. **Kelly Martinez, RN** - Registered Nurse
- **Email**: `nurse.kelly@citymedical.com`
- **Password**: `nurse123`
- **License**: `RN-44556`
- **Specialty**: Registered Nurse
- **Department**: Chronic Care Management
- **Hospital**: City Medical Center

---

## 🚀 How to Use

### Quick Access via Login Page:
1. Navigate to `/auth/login`
2. Click on the **Clinician** tab
3. Click **"Show Test Accounts"** button
4. Click **"Use"** next to any account to auto-fill the form
5. Click **"Sign In"** to authenticate

### Manual Login:
1. Go to `/auth/login`
2. Select the **Clinician** tab
3. Enter any of the above credentials manually
4. All three fields (email, password, license) are required
5. Click **"Sign In"**

---

## 📱 After Login

Once authenticated, you'll be redirected to `/clinical` where you can:

- **View Clinical Dashboard**: Patient overview, alerts, and statistics
- **Search Patients**: Use `/clinical/search` for advanced patient search
- **View Patient Details**: Click on any patient to see comprehensive medical information
- **Access Patient Timeline**: View chronological medical history
- **Manage Clinical Notes**: Add and view clinical notes

---

## 🔍 Sample Patients Available

The system includes 3 comprehensive patient records:

1. **Sarah Johnson** (VC-2025-001234) - High Risk Diabetes Patient
2. **Michael Rodriguez** (VC-2025-001567) - Moderate Risk Hypertension
3. **Lisa Thompson** (VC-2025-001890) - Moderate Risk Heart Disease

---

## 🛠️ Technical Notes

- Session management uses localStorage for prototype simplicity
- Authentication state persists across browser sessions
- No server-side validation (frontend only for demo)
- All patient data is mock/sample data for demonstration

---

## 📞 Demo Flow Recommendations

For the best demonstration experience:

1. **Login** as Dr. Emily Chen (primary endocrinologist)
2. **Search** for patient "VC-2025-001234" or "Sarah Johnson"
3. **View** comprehensive patient details with diabetes management
4. **Review** patient timeline showing medical history
5. **Check** clinical alerts and risk factors
6. **Navigate** between dashboard, search, and patient detail pages

---

*This authentication system is designed solely for prototype demonstration and should not be used in production environments.*
