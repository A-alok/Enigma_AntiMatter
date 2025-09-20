"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Patient } from "@/lib/patient-data"
import { ClinicalNavigation } from "@/components/clinical-navigation"
import { AdvancedPatientSearch } from "@/components/advanced-patient-search"
import { AlertTriangle, Users, Search, TrendingUp, Calendar, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ClinicalSearchPage() {
  const [searchResults, setSearchResults] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const router = useRouter()

  // Mock clinical data - in real app this would come from API
  const clinicalData = {
    provider: {
      name: "Dr. Emily Chen",
      specialty: "Endocrinology",
      license: "MD-12345",
      hospital: "City Medical Center",
    },
    searchStats: {
      totalPatients: 247,
      highRiskPatients: 23,
      recentSearches: [
        "VC-2025-001234",
        "diabetes patients",
        "high risk hypertension",
        "Sarah Johnson"
      ]
    }
  }

  const handlePatientsFound = (patients: Patient[]) => {
    setSearchResults(patients)
  }

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    // Navigate to patient detail page
    router.push(`/clinical/patients/${patient.id}`)
  }

  const getSearchSummary = () => {
    if (searchResults.length === 0) return null

    const highRisk = searchResults.filter(p => p.riskLevel === 'high').length
    const withAlerts = searchResults.filter(p => p.alerts.some(alert => !alert.acknowledged)).length
    const conditions = [...new Set(searchResults.map(p => p.primaryCondition))]

    return {
      total: searchResults.length,
      highRisk,
      withAlerts,
      conditions: conditions.slice(0, 3)
    }
  }

  const summary = getSearchSummary()

  return (
    <div className="min-h-screen bg-background">
      <ClinicalNavigation provider={clinicalData.provider} />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/clinical" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-3xl font-bold mb-2">Patient Search</h1>
              <p className="text-muted-foreground">
                Search and find patients by ID, name, condition, or advanced criteria
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Recent Searches
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Search Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{clinicalData.searchStats.totalPatients}</div>
                  <div className="text-xs text-muted-foreground">Total Patients</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-destructive">{clinicalData.searchStats.highRiskPatients}</div>
                  <div className="text-xs text-muted-foreground">High Risk</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{searchResults.length}</div>
                  <div className="text-xs text-muted-foreground">Search Results</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{summary?.withAlerts || 0}</div>
                  <div className="text-xs text-muted-foreground">With Alerts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Results Summary */}
        {summary && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Search Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{summary.total} patients found</Badge>
                </div>
                {summary.highRisk > 0 && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">{summary.highRisk} high risk</Badge>
                  </div>
                )}
                {summary.withAlerts > 0 && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {summary.withAlerts} with alerts
                    </Badge>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Conditions:</span>
                  {summary.conditions.map((condition, index) => (
                    <Badge key={condition} variant="secondary" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Advanced Patient Search Component */}
        <AdvancedPatientSearch
          onPatientsFound={handlePatientsFound}
          onPatientSelect={handlePatientSelect}
          showResults={true}
          placeholder="Enter Patient ID (e.g., VC-2025-001234) or patient name..."
        />

        {/* Recent Searches */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Searches
            </CardTitle>
            <CardDescription>
              Quick access to your recent patient searches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {clinicalData.searchStats.recentSearches.map((search, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    // Handle recent search click
                    console.log(`Searching for: ${search}`)
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{search}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {index === 0 ? "Today" : index === 1 ? "Yesterday" : `${index + 1}d ago`}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common search patterns and patient management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="justify-start h-auto p-4 text-left"
                onClick={() => {
                  // Search for high risk patients
                  console.log("Searching for high risk patients")
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="font-medium">High Risk Patients</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Show all patients with high risk scores
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4 text-left"
                onClick={() => {
                  // Search for patients with alerts
                  console.log("Searching for patients with active alerts")
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">Active Alerts</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Patients with unacknowledged alerts
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4 text-left"
                onClick={() => {
                  // Search for diabetes patients
                  console.log("Searching for diabetes patients")
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Diabetes Patients</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All patients with diabetes diagnosis
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4 text-left"
                onClick={() => {
                  // Search for upcoming appointments
                  console.log("Searching for upcoming appointments")
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Upcoming Appointments</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Patients with appointments this week
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4 text-left"
                onClick={() => {
                  // Search for medication adherence issues
                  console.log("Searching for medication adherence issues")
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Adherence Issues</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Patients with low medication adherence
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4 text-left"
                onClick={() => {
                  // Add new patient
                  console.log("Add new patient")
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Plus className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">Add New Patient</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Register a new patient in the system
                  </p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
