"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getPatientById, Patient } from "@/lib/patient-data"
import { ClinicalNavigation } from "@/components/clinical-navigation"
import { PatientTimeline } from "@/components/patient-timeline"
import { 
  ArrowLeft, User, Phone, Mail, MapPin, AlertTriangle, Calendar, 
  FileText, Pill, Activity, Heart, TrendingUp, Clock, Edit, 
  MessageSquare, Plus, Download, Share
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PatientDetailPage() {
  const params = useParams()
  const patientId = params.id as string
  const [activeTab, setActiveTab] = useState("overview")
  const [newNote, setNewNote] = useState("")

  // Get patient data
  const patient = getPatientById(patientId)

  // Mock clinical provider data
  const clinicalData = {
    provider: {
      name: "Dr. Emily Chen",
      specialty: "Endocrinology",
      license: "MD-12345",
      hospital: "City Medical Center",
    }
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background">
        <ClinicalNavigation provider={clinicalData.provider} />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Patient Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The patient with ID "{patientId}" could not be found.
            </p>
            <Button asChild>
              <Link href="/clinical/search">Back to Search</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "text-destructive"
      case "moderate": return "text-yellow-600"
      case "low": return "text-green-600"
      default: return "text-muted-foreground"
    }
  }

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "high": return "destructive"
      case "moderate": return "outline"
      case "low": return "secondary"
      default: return "secondary"
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      "normal": "secondary",
      "elevated": "destructive", 
      "low": "outline",
      "critical": "destructive"
    } as const
    return variants[status as keyof typeof variants] || "secondary"
  }

  const unacknowledgedAlerts = patient.alerts.filter(alert => !alert.acknowledged)

  return (
    <div className="min-h-screen bg-background">
      <ClinicalNavigation provider={clinicalData.provider} />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
          <div className="flex items-start space-x-4">
            <Button variant="ghost" size="sm" asChild className="mt-1">
              <Link href="/clinical" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </Button>
            <div className="h-6 w-px bg-border mt-2" />
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                <User className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{patient.name}</h1>
                  <Badge variant={getRiskBadgeVariant(patient.riskLevel)}>
                    {patient.riskLevel} Risk
                  </Badge>
                  {unacknowledgedAlerts.length > 0 && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {unacknowledgedAlerts.length} Alert{unacknowledgedAlerts.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {patient.id}
                  </span>
                  <span>Age {patient.age} • {patient.gender}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    DOB: {patient.dateOfBirth}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {patient.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {patient.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Patient
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Critical Alerts */}
        {unacknowledgedAlerts.length > 0 && (
          <Alert className="mb-6 border-destructive bg-destructive/5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>{unacknowledgedAlerts.length} critical alert{unacknowledgedAlerts.length > 1 ? 's' : ''}</strong> require immediate attention.
                  <div className="mt-2 space-y-1">
                    {unacknowledgedAlerts.slice(0, 2).map(alert => (
                      <div key={alert.id} className="text-sm">
                        • {alert.message}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="destructive">
                    Review Alerts
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Risk Score Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getRiskColor(patient.riskLevel)}`}>
                  {patient.riskScore}
                </div>
                <div className="text-sm text-muted-foreground">Risk Score</div>
                <Badge variant={getRiskBadgeVariant(patient.riskLevel)} className="mt-2">
                  {patient.riskLevel} Risk
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{patient.conditions.length}</div>
                <div className="text-sm text-muted-foreground">Active Conditions</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Primary: {patient.primaryCondition}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{patient.medications.length}</div>
                <div className="text-sm text-muted-foreground">Medications</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Avg Adherence: {Math.round(patient.medications.reduce((sum, med) => sum + med.adherence, 0) / patient.medications.length)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{patient.appointments.length}</div>
                <div className="text-sm text-muted-foreground">Appointments</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Next: {patient.nextAppointment}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vitals">Vitals & Labs</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Current Vitals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Current Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Blood Pressure</div>
                      <div className="font-semibold text-lg text-destructive">{patient.vitals.bloodPressure}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Heart Rate</div>
                      <div className="font-semibold text-lg">{patient.vitals.heartRate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Weight</div>
                      <div className="font-semibold text-lg">{patient.vitals.weight}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">BMI</div>
                      <div className="font-semibold text-lg">{patient.vitals.bmi}</div>
                    </div>
                    {patient.vitals.bloodSugar !== "N/A" && (
                      <>
                        <div>
                          <div className="text-sm text-muted-foreground">Blood Sugar</div>
                          <div className="font-semibold text-lg">{patient.vitals.bloodSugar}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">O2 Saturation</div>
                          <div className="font-semibold text-lg">{patient.vitals.oxygenSaturation}</div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Factors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patient.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                        <span className="text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conditions and Allergies */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {patient.conditions.map((condition, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{condition}</span>
                        {condition === patient.primaryCondition && (
                          <Badge variant="secondary" className="text-xs">Primary</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Allergies & Family History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Allergies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {patient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-sm mb-2">Family History:</h4>
                      <div className="space-y-1">
                        {patient.familyHistory.map((history, index) => (
                          <div key={index} className="text-xs text-muted-foreground">
                            {history.relation}: {history.condition}
                            {history.ageOfOnset && ` (age ${history.ageOfOnset})`}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Lab Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patient.labResults.map((lab) => (
                      <div key={lab.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{lab.test}</div>
                          <div className="text-sm text-muted-foreground">
                            {lab.date} • Ordered by {lab.orderedBy}
                          </div>
                          {lab.notes && (
                            <div className="text-xs text-muted-foreground mt-1">{lab.notes}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">{lab.value}</div>
                          <div className="text-xs text-muted-foreground mb-2">
                            Normal: {lab.normalRange}
                          </div>
                          <Badge variant={getStatusBadge(lab.status)} className="text-xs">
                            {lab.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="medications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Current Medications
                </CardTitle>
                <CardDescription>
                  Active medications and adherence monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.medications.map((medication) => (
                    <div key={medication.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-lg">{medication.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {medication.dosage} • {medication.frequency}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Started: {medication.startDate} • Prescribed by {medication.prescribedBy}
                        </div>
                        {medication.notes && (
                          <div className="text-xs text-blue-600 mt-1">
                            Note: {medication.notes}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-2xl">{medication.adherence}%</div>
                        <div className="text-xs text-muted-foreground mb-2">Adherence</div>
                        <Badge 
                          variant={medication.adherence >= 90 ? "secondary" : medication.adherence >= 70 ? "outline" : "destructive"} 
                          className="text-xs"
                        >
                          {medication.adherence >= 90 ? "Good" : medication.adherence >= 70 ? "Fair" : "Poor"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <PatientTimeline patient={patient} showAllEvents={false} maxEvents={15} />
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Clinical Note
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-note">Clinical Note</Label>
                      <Textarea
                        id="new-note"
                        placeholder="Enter clinical observations, treatment plans, or follow-up notes..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="mt-2 min-h-[100px]"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm">Save Note</Button>
                      <Button size="sm" variant="outline">Save & Schedule Follow-up</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Clinical Notes History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patient.clinicalNotes.map((note) => (
                      <div key={note.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{note.subject}</h4>
                          <Badge variant="outline" className="text-xs">
                            {note.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{note.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {note.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {note.provider}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Full Name</Label>
                      <div className="text-sm">{patient.name}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Gender</Label>
                      <div className="text-sm">{patient.gender}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Date of Birth</Label>
                      <div className="text-sm">{patient.dateOfBirth}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Age</Label>
                      <div className="text-sm">{patient.age} years</div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium">Contact Information</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4" />
                        {patient.email}
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <div>
                          {patient.address.street}<br />
                          {patient.address.city}, {patient.address.state} {patient.address.zipCode}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact & Insurance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Emergency Contact</Label>
                    <div className="mt-2 space-y-1">
                      <div className="text-sm font-medium">{patient.emergencyContact.name}</div>
                      <div className="text-sm text-muted-foreground">{patient.emergencyContact.relationship}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4" />
                        {patient.emergencyContact.phone}
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium">Insurance Information</Label>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="text-sm font-medium">Provider:</span>
                        <span className="text-sm ml-2">{patient.insurance.provider}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Policy:</span>
                        <span className="text-sm ml-2">{patient.insurance.policyNumber}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Group:</span>
                        <span className="text-sm ml-2">{patient.insurance.groupNumber}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium">Social History</Label>
                    <div className="mt-2 space-y-2 text-sm">
                      <div><strong>Smoking:</strong> {patient.socialHistory.smoking}</div>
                      <div><strong>Alcohol:</strong> {patient.socialHistory.alcohol}</div>
                      <div><strong>Exercise:</strong> {patient.socialHistory.exercise}</div>
                      <div><strong>Diet:</strong> {patient.socialHistory.diet}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
