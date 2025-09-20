// PROTOTYPE ONLY - Hardcoded Clinical Credentials
// In a real application, this would use proper authentication with encrypted passwords

export interface ClinicalCredentials {
  email: string
  password: string
  licenseNumber: string
  provider: {
    name: string
    specialty: string
    license: string
    hospital: string
    department?: string
  }
}

// Hardcoded clinical accounts for prototype demonstration
export const clinicalAccounts: ClinicalCredentials[] = [
  {
    email: "dr.emily.chen@citymedical.com",
    password: "clinical123",
    licenseNumber: "MD-12345",
    provider: {
      name: "Dr. Emily Chen",
      specialty: "Endocrinology",
      license: "MD-12345",
      hospital: "City Medical Center",
      department: "Endocrinology & Diabetes"
    }
  },
  {
    email: "dr.sarah.wilson@citymedical.com",
    password: "clinical456",
    licenseNumber: "MD-67890",
    provider: {
      name: "Dr. Sarah Wilson",
      specialty: "Cardiology",
      license: "MD-67890",
      hospital: "City Medical Center",
      department: "Cardiovascular Medicine"
    }
  },
  {
    email: "dr.michael.brown@citymedical.com",
    password: "clinical789",
    licenseNumber: "MD-11223",
    provider: {
      name: "Dr. Michael Brown",
      specialty: "Internal Medicine",
      license: "MD-11223",
      hospital: "City Medical Center",
      department: "Internal Medicine"
    }
  },
  {
    email: "nurse.kelly@citymedical.com",
    password: "nurse123",
    licenseNumber: "RN-44556",
    provider: {
      name: "Kelly Martinez, RN",
      specialty: "Registered Nurse",
      license: "RN-44556",
      hospital: "City Medical Center",
      department: "Chronic Care Management"
    }
  }
]

// Authentication function for prototype
export function authenticateClinical(email: string, password: string, licenseNumber: string): ClinicalCredentials | null {
  const account = clinicalAccounts.find(
    acc => acc.email.toLowerCase() === email.toLowerCase() && 
           acc.password === password && 
           acc.licenseNumber === licenseNumber
  )
  
  return account || null
}

// Get all available test accounts for documentation
export function getTestAccounts() {
  return clinicalAccounts.map(account => ({
    email: account.email,
    password: account.password,
    licenseNumber: account.licenseNumber,
    providerName: account.provider.name,
    specialty: account.provider.specialty
  }))
}

// Simple session management for prototype
export function setClinicalSession(credentials: ClinicalCredentials) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('clinical_session', JSON.stringify({
      email: credentials.email,
      provider: credentials.provider,
      loginTime: new Date().toISOString()
    }))
  }
}

export function getClinicalSession() {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('clinical_session')
    return session ? JSON.parse(session) : null
  }
  return null
}

export function clearClinicalSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('clinical_session')
  }
}

export function isAuthenticated(): boolean {
  const session = getClinicalSession()
  return session !== null
}
