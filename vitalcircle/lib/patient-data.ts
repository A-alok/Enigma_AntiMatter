export interface Patient {
  id: string
  name: string
  age: number
  dateOfBirth: string
  gender: string
  phone: string
  email: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  insurance: {
    provider: string
    policyNumber: string
    groupNumber: string
  }
  primaryCondition: string
  conditions: string[]
  allergies: string[]
  riskScore: number
  riskLevel: "low" | "moderate" | "high"
  lastVisit: string
  nextAppointment: string
  status: "active" | "stable" | "critical" | "inactive"
  assignedProvider: string
  vitals: {
    bloodPressure: string
    bloodSugar: string
    weight: string
    height: string
    heartRate: string
    temperature: string
    oxygenSaturation: string
    bmi: string
  }
  medications: Array<{
    id: string
    name: string
    dosage: string
    frequency: string
    startDate: string
    endDate?: string
    adherence: number
    prescribedBy: string
    notes?: string
  }>
  labResults: Array<{
    id: string
    test: string
    value: string
    normalRange: string
    date: string
    status: "normal" | "elevated" | "low" | "critical"
    orderedBy: string
    notes?: string
  }>
  appointments: Array<{
    id: string
    date: string
    time: string
    provider: string
    type: string
    status: "scheduled" | "completed" | "cancelled" | "no-show"
    notes?: string
  }>
  clinicalNotes: Array<{
    id: string
    date: string
    provider: string
    type: "visit" | "phone" | "email" | "urgent"
    subject: string
    content: string
    attachments?: string[]
  }>
  riskFactors: string[]
  familyHistory: Array<{
    relation: string
    condition: string
    ageOfOnset?: number
  }>
  socialHistory: {
    smoking: "never" | "former" | "current"
    alcohol: "none" | "occasional" | "moderate" | "heavy"
    exercise: "none" | "light" | "moderate" | "heavy"
    diet: string
  }
  alerts: Array<{
    id: string
    type: "risk_increase" | "medication_adherence" | "vitals_abnormal" | "appointment_missed"
    severity: "low" | "medium" | "high" | "critical"
    message: string
    timestamp: string
    acknowledged: boolean
    acknowledgedBy?: string
  }>
  interventions: Array<{
    id: string
    date: string
    type: string
    description: string
    outcome?: string
    provider: string
  }>
  createdAt: string
  updatedAt: string
}

// Mock comprehensive patient data
export const mockPatients: Patient[] = [
  {
    id: "VC-2025-001234",
    name: "Sarah Johnson",
    age: 45,
    dateOfBirth: "1978-03-15",
    gender: "Female",
    phone: "(555) 123-4567",
    email: "sarah.johnson@email.com",
    address: {
      street: "123 Oak Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62701"
    },
    emergencyContact: {
      name: "John Johnson",
      relationship: "Spouse",
      phone: "(555) 123-4568"
    },
    insurance: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BC123456789",
      groupNumber: "GRP001"
    },
    primaryCondition: "Type 2 Diabetes",
    conditions: ["Type 2 Diabetes", "Hypertension", "Prediabetic Neuropathy"],
    allergies: ["Penicillin", "Shellfish"],
    riskScore: 45,
    riskLevel: "high",
    lastVisit: "2024-12-10",
    nextAppointment: "2024-12-15",
    status: "active",
    assignedProvider: "Dr. Emily Chen",
    vitals: {
      bloodPressure: "132/88",
      bloodSugar: "165 mg/dL",
      weight: "165 lbs",
      height: "5'6\"",
      heartRate: "78 bpm",
      temperature: "98.6°F",
      oxygenSaturation: "98%",
      bmi: "26.6"
    },
    medications: [
      {
        id: "med1",
        name: "Metformin",
        dosage: "500mg",
        frequency: "2x daily",
        startDate: "2023-01-15",
        adherence: 95,
        prescribedBy: "Dr. Emily Chen",
        notes: "Take with meals"
      },
      {
        id: "med2",
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "1x daily",
        startDate: "2023-03-20",
        adherence: 88,
        prescribedBy: "Dr. Emily Chen",
        notes: "Monitor for dry cough"
      }
    ],
    labResults: [
      {
        id: "lab1",
        test: "HbA1c",
        value: "7.2%",
        normalRange: "<7.0%",
        date: "2024-12-01",
        status: "elevated",
        orderedBy: "Dr. Emily Chen",
        notes: "Trending upward from previous 6.8%"
      },
      {
        id: "lab2",
        test: "Total Cholesterol",
        value: "195 mg/dL",
        normalRange: "<200 mg/dL",
        date: "2024-12-01",
        status: "normal",
        orderedBy: "Dr. Emily Chen"
      },
      {
        id: "lab3",
        test: "Creatinine",
        value: "1.1 mg/dL",
        normalRange: "0.6-1.2 mg/dL",
        date: "2024-12-01",
        status: "normal",
        orderedBy: "Dr. Emily Chen"
      }
    ],
    appointments: [
      {
        id: "apt1",
        date: "2024-12-15",
        time: "10:00 AM",
        provider: "Dr. Emily Chen",
        type: "Follow-up",
        status: "scheduled",
        notes: "Diabetes management review"
      },
      {
        id: "apt2",
        date: "2024-12-10",
        time: "2:30 PM",
        provider: "Dr. Emily Chen",
        type: "Routine Check-up",
        status: "completed",
        notes: "Blood pressure elevated, discussed medication adherence"
      }
    ],
    clinicalNotes: [
      {
        id: "note1",
        date: "2024-12-10",
        provider: "Dr. Emily Chen",
        type: "visit",
        subject: "Routine Diabetes Follow-up",
        content: "Patient reports good adherence to Metformin but occasional missed doses of Lisinopril. Blood pressure elevated at 132/88. HbA1c trending upward. Discussed importance of medication compliance and dietary modifications. Patient agrees to home BP monitoring."
      },
      {
        id: "note2",
        date: "2024-12-08",
        provider: "Nurse Kelly",
        type: "phone",
        subject: "Medication Adherence Check",
        content: "Patient called regarding missed Lisinopril doses over weekend. Counseled on importance of consistent dosing. Patient will resume regular schedule."
      }
    ],
    riskFactors: [
      "Blood pressure trending upward",
      "Medication adherence declining",
      "Weight gain over past month",
      "HbA1c above target"
    ],
    familyHistory: [
      {
        relation: "Mother",
        condition: "Type 2 Diabetes",
        ageOfOnset: 52
      },
      {
        relation: "Father",
        condition: "Hypertension",
        ageOfOnset: 48
      }
    ],
    socialHistory: {
      smoking: "never",
      alcohol: "occasional",
      exercise: "light",
      diet: "Low-sodium, diabetic-friendly diet with occasional lapses"
    },
    alerts: [
      {
        id: "alert1",
        type: "risk_increase",
        severity: "high",
        message: "Stability score dropped to 45 - hypertensive episode risk increased",
        timestamp: "2 hours ago",
        acknowledged: false
      }
    ],
    interventions: [
      {
        id: "int1",
        date: "2024-12-10",
        type: "Medication Adjustment",
        description: "Discussed increasing Lisinopril dose to 15mg daily",
        outcome: "Patient agreed to trial increase",
        provider: "Dr. Emily Chen"
      }
    ],
    createdAt: "2023-01-10T08:00:00Z",
    updatedAt: "2024-12-10T14:30:00Z"
  },
  {
    id: "VC-2025-001567",
    name: "Michael Rodriguez",
    age: 52,
    dateOfBirth: "1971-08-22",
    gender: "Male",
    phone: "(555) 234-5678",
    email: "michael.rodriguez@email.com",
    address: {
      street: "456 Pine Avenue",
      city: "Springfield",
      state: "IL",
      zipCode: "62702"
    },
    emergencyContact: {
      name: "Maria Rodriguez",
      relationship: "Wife",
      phone: "(555) 234-5679"
    },
    insurance: {
      provider: "Aetna",
      policyNumber: "AET987654321",
      groupNumber: "GRP002"
    },
    primaryCondition: "Hypertension",
    conditions: ["Hypertension", "Hyperlipidemia"],
    allergies: ["Codeine"],
    riskScore: 68,
    riskLevel: "moderate",
    lastVisit: "2024-12-08",
    nextAppointment: "2024-12-20",
    status: "active",
    assignedProvider: "Dr. Emily Chen",
    vitals: {
      bloodPressure: "145/92",
      bloodSugar: "N/A",
      weight: "180 lbs",
      height: "5'9\"",
      heartRate: "72 bpm",
      temperature: "98.4°F",
      oxygenSaturation: "99%",
      bmi: "26.6"
    },
    medications: [
      {
        id: "med3",
        name: "Amlodipine",
        dosage: "5mg",
        frequency: "1x daily",
        startDate: "2023-06-15",
        adherence: 70,
        prescribedBy: "Dr. Emily Chen"
      },
      {
        id: "med4",
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "1x daily",
        startDate: "2023-06-15",
        adherence: 85,
        prescribedBy: "Dr. Emily Chen"
      }
    ],
    labResults: [
      {
        id: "lab4",
        test: "Lipid Panel",
        value: "LDL: 135 mg/dL",
        normalRange: "LDL: <100 mg/dL",
        date: "2024-11-28",
        status: "elevated",
        orderedBy: "Dr. Emily Chen"
      }
    ],
    appointments: [
      {
        id: "apt3",
        date: "2024-12-20",
        time: "9:15 AM",
        provider: "Dr. Emily Chen",
        type: "Follow-up",
        status: "scheduled"
      }
    ],
    clinicalNotes: [
      {
        id: "note3",
        date: "2024-12-08",
        provider: "Dr. Emily Chen",
        type: "visit",
        subject: "Hypertension Management",
        content: "Blood pressure remains elevated despite medication. Patient admits to inconsistent medication adherence. Discussed importance of daily routine. Consider medication adjustment if adherence doesn't improve."
      }
    ],
    riskFactors: ["Poor medication adherence", "Elevated blood pressure", "Family history of CVD"],
    familyHistory: [
      {
        relation: "Father",
        condition: "Myocardial Infarction",
        ageOfOnset: 55
      }
    ],
    socialHistory: {
      smoking: "former",
      alcohol: "moderate",
      exercise: "light",
      diet: "Standard American diet"
    },
    alerts: [
      {
        id: "alert2",
        type: "medication_adherence",
        severity: "medium",
        message: "Medication adherence below 70% for past week",
        timestamp: "4 hours ago",
        acknowledged: false
      }
    ],
    interventions: [],
    createdAt: "2023-06-10T10:00:00Z",
    updatedAt: "2024-12-08T11:15:00Z"
  },
  {
    id: "VC-2025-001890",
    name: "Lisa Thompson",
    age: 38,
    dateOfBirth: "1985-11-03",
    gender: "Female",
    phone: "(555) 345-6789",
    email: "lisa.thompson@email.com",
    address: {
      street: "789 Maple Drive",
      city: "Springfield",
      state: "IL",
      zipCode: "62703"
    },
    emergencyContact: {
      name: "David Thompson",
      relationship: "Brother",
      phone: "(555) 345-6790"
    },
    insurance: {
      provider: "United Healthcare",
      policyNumber: "UHC456789012",
      groupNumber: "GRP003"
    },
    primaryCondition: "Heart Disease",
    conditions: ["Coronary Artery Disease", "Hypertension"],
    allergies: ["Ibuprofen", "Latex"],
    riskScore: 72,
    riskLevel: "moderate",
    lastVisit: "2024-12-12",
    nextAppointment: "2024-12-18",
    status: "active",
    assignedProvider: "Dr. Emily Chen",
    vitals: {
      bloodPressure: "142/90",
      bloodSugar: "N/A",
      weight: "155 lbs",
      height: "5'4\"",
      heartRate: "68 bpm",
      temperature: "98.2°F",
      oxygenSaturation: "97%",
      bmi: "26.6"
    },
    medications: [
      {
        id: "med5",
        name: "Metoprolol",
        dosage: "50mg",
        frequency: "2x daily",
        startDate: "2024-01-15",
        adherence: 92,
        prescribedBy: "Dr. Emily Chen"
      },
      {
        id: "med6",
        name: "Clopidogrel",
        dosage: "75mg",
        frequency: "1x daily",
        startDate: "2024-01-15",
        adherence: 96,
        prescribedBy: "Dr. Emily Chen"
      }
    ],
    labResults: [
      {
        id: "lab5",
        test: "Troponin",
        value: "<0.01 ng/mL",
        normalRange: "<0.04 ng/mL",
        date: "2024-12-12",
        status: "normal",
        orderedBy: "Dr. Emily Chen"
      }
    ],
    appointments: [
      {
        id: "apt4",
        date: "2024-12-18",
        time: "1:45 PM",
        provider: "Dr. Emily Chen",
        type: "Cardiology Follow-up",
        status: "scheduled"
      }
    ],
    clinicalNotes: [
      {
        id: "note4",
        date: "2024-12-12",
        provider: "Dr. Emily Chen",
        type: "visit",
        subject: "Cardiac Follow-up",
        content: "Patient reports occasional chest tightness with exertion. Blood pressure consistently elevated. EKG stable. Good medication adherence. Discussed stress management and cardiac rehabilitation options."
      }
    ],
    riskFactors: ["Persistent hypertension", "Sedentary lifestyle", "Work-related stress"],
    familyHistory: [
      {
        relation: "Mother",
        condition: "Stroke",
        ageOfOnset: 62
      }
    ],
    socialHistory: {
      smoking: "never",
      alcohol: "none",
      exercise: "none",
      diet: "Heart-healthy diet, good compliance"
    },
    alerts: [
      {
        id: "alert3",
        type: "vitals_abnormal",
        severity: "high",
        message: "Blood pressure readings consistently elevated (>140/90)",
        timestamp: "6 hours ago",
        acknowledged: false
      }
    ],
    interventions: [
      {
        id: "int2",
        date: "2024-12-12",
        type: "Lifestyle Counseling",
        description: "Discussed cardiac rehabilitation program enrollment",
        outcome: "Patient interested, will provide referral",
        provider: "Dr. Emily Chen"
      }
    ],
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-12-12T15:20:00Z"
  }
]

export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find(patient => patient.id === id)
}

export function searchPatients(query: string): Patient[] {
  if (!query) return mockPatients
  
  const lowercaseQuery = query.toLowerCase()
  return mockPatients.filter(patient => 
    patient.id.toLowerCase().includes(lowercaseQuery) ||
    patient.name.toLowerCase().includes(lowercaseQuery) ||
    patient.primaryCondition.toLowerCase().includes(lowercaseQuery) ||
    patient.conditions.some(condition => condition.toLowerCase().includes(lowercaseQuery))
  )
}

export function filterPatients(patients: Patient[], filters: {
  riskLevel?: string
  condition?: string
  status?: string
  provider?: string
}): Patient[] {
  return patients.filter(patient => {
    if (filters.riskLevel && filters.riskLevel !== "all" && patient.riskLevel !== filters.riskLevel) return false
    if (filters.condition && filters.condition !== "all" && !patient.conditions.includes(filters.condition)) return false
    if (filters.status && filters.status !== "all" && patient.status !== filters.status) return false
    if (filters.provider && filters.provider !== "all" && patient.assignedProvider !== filters.provider) return false
    return true
  })
}
