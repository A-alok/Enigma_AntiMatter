"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Search, Calendar, Plus } from "lucide-react"
import { ClinicalNavigation } from "@/components/clinical-navigation"
import { PatientRiskTable } from "@/components/patient-risk-table"
import { PatientDetailModal } from "@/components/patient-detail-modal"
import { AlertsPanel } from "@/components/alerts-panel"
import { ClinicalStats } from "@/components/clinical-stats"

export default function ClinicalDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")
  const [conditionFilter, setConditionFilter] = useState("all")

  // Mock clinical data - in real app this would come from API
  const clinicalData = {
    provider: {
      name: "Dr. Emily Chen",
      specialty: "Endocrinology",
      license: "MD-12345",
      hospital: "City Medical Center",
    },
    stats: {
      totalPatients: 247,
      highRiskPatients: 23,
      pendingAlerts: 8,
      appointmentsToday: 12,
    },
    alerts: [
      {
        id: "1",
        patientId: "VC-2025-001234",
        patientName: "Sarah Johnson",
        type: "risk_increase",
        severity: "high",
        message: "Stability score dropped to 45 - hypertensive episode risk increased",
        timestamp: "2 hours ago",
        condition: "Type 2 Diabetes",
      },
      {
        id: "2",
        patientId: "VC-2025-001567",
        patientName: "Michael Rodriguez",
        type: "medication_adherence",
        severity: "medium",
        message: "Medication adherence below 70% for past week",
        timestamp: "4 hours ago",
        condition: "Hypertension",
      },
      {
        id: "3",
        patientId: "VC-2025-001890",
        patientName: "Lisa Thompson",
        type: "vitals_abnormal",
        severity: "high",
        message: "Blood pressure readings consistently elevated (&gt;140/90)",
        timestamp: "6 hours ago",
        condition: "Heart Disease",
      },
    ],
    patients: [
      {
        id: "VC-2025-001234",
        name: "Sarah Johnson",
        age: 45,
        condition: "Type 2 Diabetes",
        riskScore: 45,
        riskLevel: "high",
        lastVisit: "2024-12-10",
        nextAppointment: "2024-12-15",
        status: "active",
        vitals: {
          bloodPressure: "132/88",
          bloodSugar: "165 mg/dL",
          weight: "165 lbs",
        },
      },
      {
        id: "VC-2025-001567",
        name: "Michael Rodriguez",
        age: 52,
        condition: "Hypertension",
        riskScore: 68,
        riskLevel: "moderate",
        lastVisit: "2024-12-08",
        nextAppointment: "2024-12-20",
        status: "active",
        vitals: {
          bloodPressure: "145/92",
          bloodSugar: "N/A",
          weight: "180 lbs",
        },
      },
      {
        id: "VC-2025-001890",
        name: "Lisa Thompson",
        age: 38,
        condition: "Heart Disease",
        riskScore: 72,
        riskLevel: "moderate",
        lastVisit: "2024-12-12",
        nextAppointment: "2024-12-18",
        status: "active",
        vitals: {
          bloodPressure: "142/90",
          bloodSugar: "N/A",
          weight: "155 lbs",
        },
      },
      {
        id: "VC-2025-002123",
        name: "Robert Kim",
        age: 61,
        condition: "COPD",
        riskScore: 85,
        riskLevel: "low",
        lastVisit: "2024-12-11",
        nextAppointment: "2024-12-25",
        status: "stable",
        vitals: {
          bloodPressure: "125/78",
          bloodSugar: "N/A",
          weight: "170 lbs",
        },
      },
    ],
  }

  const filteredPatients = clinicalData.patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRisk = riskFilter === "all" || patient.riskLevel === riskFilter
    const matchesCondition = conditionFilter === "all" || patient.condition === conditionFilter
    return matchesSearch && matchesRisk && matchesCondition
  })

  return (
    <div className="min-h-screen bg-background">
      <ClinicalNavigation provider={clinicalData.provider} />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Clinical Dashboard</h1>
            <p className="text-muted-foreground">
              Managing {clinicalData.stats.totalPatients} patients • {clinicalData.stats.pendingAlerts} pending alerts
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Today's Schedule
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Critical Alerts */}
        {clinicalData.alerts.filter((alert) => alert.severity === "high").length > 0 && (
          <Alert className="mb-6 border-destructive bg-destructive/5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription>
              <strong>{clinicalData.alerts.filter((alert) => alert.severity === "high").length} critical alerts</strong>{" "}
              require immediate attention.
              <Button variant="link" className="p-0 ml-2 h-auto text-destructive">
                Review now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <ClinicalStats stats={clinicalData.stats} />

        {/* Main Dashboard */}
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patients">Patient Management</TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts
              {clinicalData.stats.pendingAlerts > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {clinicalData.stats.pendingAlerts}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="protocols">Care Protocols</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Search & Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or Patient ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Risk Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="moderate">Moderate Risk</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={conditionFilter} onValueChange={setConditionFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      <SelectItem value="Type 2 Diabetes">Type 2 Diabetes</SelectItem>
                      <SelectItem value="Hypertension">Hypertension</SelectItem>
                      <SelectItem value="Heart Disease">Heart Disease</SelectItem>
                      <SelectItem value="COPD">COPD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Patient Table */}
            <PatientRiskTable patients={filteredPatients} onPatientSelect={setSelectedPatient} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsPanel alerts={clinicalData.alerts} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                  <CardDescription>Patient risk levels across your practice</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High Risk</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 h-2 bg-muted rounded-full">
                          <div className="w-1/4 h-2 bg-destructive rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">23 patients</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Moderate Risk</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 h-2 bg-muted rounded-full">
                          <div className="w-2/5 h-2 bg-warning rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">89 patients</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low Risk</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 h-2 bg-muted rounded-full">
                          <div className="w-full h-2 bg-success rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">135 patients</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intervention Outcomes</CardTitle>
                  <CardDescription>Success rate of care interventions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-2">87%</div>
                    <p className="text-sm text-muted-foreground">Patients showed improvement after intervention</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Early interventions</span>
                        <span className="font-medium">94% success</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medication adjustments</span>
                        <span className="font-medium">82% success</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lifestyle modifications</span>
                        <span className="font-medium">76% success</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="protocols" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI-Suggested Care Protocols</CardTitle>
                  <CardDescription>Evidence-based intervention recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Hypertension Management Protocol</h4>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        For patients with consistently elevated BP readings (&gt;140/90)
                      </p>
                      <div className="space-y-2 text-sm">
                        <div>• Immediate medication review and adjustment</div>
                        <div>• Schedule follow-up within 2 weeks</div>
                        <div>• Lifestyle counseling on sodium reduction</div>
                        <div>• Home BP monitoring recommendation</div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Diabetes Risk Escalation</h4>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        For diabetic patients with declining stability scores
                      </p>
                      <div className="space-y-2 text-sm">
                        <div>• Review glucose logs and medication adherence</div>
                        <div>• Consider continuous glucose monitoring</div>
                        <div>• Nutritionist referral if indicated</div>
                        <div>• Increase monitoring frequency</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Patient Detail Modal */}
        {selectedPatient && <PatientDetailModal patientId={selectedPatient} onClose={() => setSelectedPatient(null)} />}
      </main>
    </div>
  )
}
