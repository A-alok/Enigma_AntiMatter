"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  Pill,
  Users,
  Plus,
  Brain,
} from "lucide-react"
import { PatientNavigation } from "@/components/patient-navigation"
import { VitalsChart } from "@/components/vitals-chart"
import { RiskScoreCard } from "@/components/risk-score-card"
import { RecommendationCard } from "@/components/recommendation-card"
import { QuickActions } from "@/components/quick-actions"
import Link from "next/link"
import { LogVitalsModal } from "@/components/log-vitals-modal"
import { ContextAwareNudges } from "@/components/context-aware-nudges"
import { NudgeDemoControls } from "@/components/nudge-demo-controls"
import { NudgesInfo } from "@/components/nudges-info"
import { PredictiveImpact } from "@/components/predictive-impact"

export default function PatientDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [currentRiskScore, setCurrentRiskScore] = useState(72)
  const [currentRiskLevel, setCurrentRiskLevel] = useState("moderate")
  const [recentLogs, setRecentLogs] = useState([
    { timestamp: '2024-12-13 08:00', sodium: 2400, calories: 650, exercise: '30min walk' },
    { timestamp: '2024-12-13 12:30', sodium: 800, calories: 450 },
    { timestamp: '2024-12-13 18:00', sodium: 1200, calories: 600 }
  ])
  
  // State for tracking logged vitals for predictions
  const [lastLoggedVitals, setLastLoggedVitals] = useState(null)
  
  // State for loading indicator
  const [isUpdatingRisk, setIsUpdatingRisk] = useState(false)
  
  // State for current vitals (to allow demo scenarios to update them)
  const [currentVitals, setCurrentVitals] = useState({
    bloodPressure: { value: "128/82", trend: "up", status: "elevated", systolic: 128, diastolic: 82 },
    bloodSugar: { value: "145 mg/dL", trend: "stable", status: "normal", level: 145 },
    weight: { value: "165 lbs", trend: "down", status: "improving", pounds: 165 },
    heartRate: { value: "78 bpm", trend: "stable", status: "normal", bpm: 78 },
  })

  const patientData = {
    name: "Sarah Johnson",
    patientId: "VC-2025-001234",
    condition: "Type 2 Diabetes",
    riskScore: currentRiskScore,
    riskLevel: currentRiskLevel,
    lastUpdate: "2 hours ago",
    vitals: currentVitals,
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "2x daily", adherence: 95, nextDose: "6:00 PM" },
      { name: "Lisinopril", dosage: "10mg", frequency: "1x daily", adherence: 88, nextDose: "Tomorrow 8:00 AM" },
    ],
    upcomingAppointments: [
      { doctor: "Dr. Smith", specialty: "Endocrinology", date: "Dec 15, 2024", time: "2:00 PM" },
      { doctor: "Dr. Johnson", specialty: "Cardiology", date: "Dec 22, 2024", time: "10:30 AM" },
    ],
  }

  const recommendations = [
    {
      type: "lifestyle",
      priority: "high",
      title: "Blood Pressure Management",
      description: "Your recent readings show elevated blood pressure. Consider reducing sodium intake today.",
      action: "Track sodium intake",
      icon: Heart,
    },
    {
      type: "medication",
      priority: "medium",
      title: "Medication Reminder",
      description: "Don't forget your evening Metformin dose at 6:00 PM.",
      action: "Set reminder",
      icon: Pill,
    },
    {
      type: "activity",
      priority: "low",
      title: "Physical Activity",
      description: "Great job on your weight progress! A 15-minute walk could help with blood sugar control.",
      action: "Log activity",
      icon: Activity,
    },
  ]

  const handleScenarioChange = (scenario: any) => {
    setCurrentRiskScore(scenario.riskScore)
    setCurrentRiskLevel(scenario.riskLevel)
    setCurrentVitals(scenario.vitals)
    setRecentLogs(scenario.logs)
    console.log("[v0] Scenario changed:", scenario)
  }

  const handleVitalsLogged = (vitals: any, riskScore: number) => {
    console.log("[v0] Starting vitals update process...", vitals, riskScore)
    
    // Show loading state immediately
    setIsUpdatingRisk(true)
    
    // Calculate risk level immediately
    const newRiskLevel = riskScore < 30 ? "low" : riskScore < 60 ? "moderate" : "high"
    
    // Update current vitals based on logged data
    const updatedVitals = {
      bloodPressure: { 
        value: `${vitals.systolic_bp}/${vitals.diastolic_bp}`, 
        trend: vitals.systolic_bp > currentVitals.bloodPressure.systolic ? "up" : "down", 
        status: vitals.systolic_bp > 140 || vitals.diastolic_bp > 90 ? "critical" : 
                vitals.systolic_bp > 130 || vitals.diastolic_bp > 80 ? "elevated" : "optimal",
        systolic: vitals.systolic_bp, 
        diastolic: vitals.diastolic_bp 
      },
      bloodSugar: { 
        ...currentVitals.bloodSugar,
        value: `${vitals.stress_level > 7 ? 165 : vitals.exercise_minutes < 20 ? 150 : 125} mg/dL`,
        level: vitals.stress_level > 7 ? 165 : vitals.exercise_minutes < 20 ? 150 : 125,
        status: vitals.stress_level > 7 ? "high" : "normal",
        trend: vitals.stress_level > 7 ? "up" : "stable"
      },
      weight: { 
        value: `${Math.round(vitals.weight * 2.20462)} lbs`, 
        trend: vitals.weight * 2.20462 < currentVitals.weight.pounds ? "down" : "up", 
        status: vitals.weight * 2.20462 < currentVitals.weight.pounds ? "improving" : "stable",
        pounds: Math.round(vitals.weight * 2.20462) 
      },
      heartRate: { 
        value: `${vitals.heart_rate} bpm`, 
        trend: vitals.heart_rate > currentVitals.heartRate.bpm ? "up" : "stable", 
        status: vitals.heart_rate > 100 ? "elevated" : vitals.heart_rate < 60 ? "low" : "normal",
        bpm: vitals.heart_rate 
      }
    }

    // Create comprehensive log entry with all vitals data
    const newLog = {
      timestamp: new Date().toISOString(),
      sodium: vitals.stress_level > 6 ? Math.floor(Math.random() * 1000) + 2500 : Math.floor(Math.random() * 800) + 1200,
      calories: vitals.exercise_minutes * 8 + Math.floor(Math.random() * 200) + 400,
      bloodPressure: `${vitals.systolic_bp}/${vitals.diastolic_bp}`,
      exercise: `${vitals.exercise_minutes}min activity`,
      sleep: `${vitals.sleep_hours}h sleep`,
      stress: vitals.stress_level,
      fatigue: vitals.fatigue_score,
      pain: vitals.pain_score
    }
    
    // Update all states immediately
    setCurrentRiskScore(riskScore)
    setCurrentRiskLevel(newRiskLevel)
    setCurrentVitals(updatedVitals)
    setRecentLogs(prev => [newLog, ...prev.slice(0, 4)])
    setLastLoggedVitals(vitals)
    
    // Clear loading state after a brief moment
    setTimeout(() => {
      setIsUpdatingRisk(false)
    }, 500)

    console.log("[v0] Vitals updated immediately:", {
      vitals,
      riskScore,
      riskLevel: newRiskLevel,
      updatedVitals,
      newLog
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <PatientNavigation />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {patientData.name}</h1>
            <p className="text-muted-foreground">
              Patient ID: {patientData.patientId} • Managing {patientData.condition}
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Badge variant="outline" className="text-sm">
              Last updated {patientData.lastUpdate}
            </Badge>
            <LogVitalsModal onVitalsLogged={handleVitalsLogged} />
          </div>
        </div>

        <Alert
          className={`mb-6 ${
            currentRiskLevel === "high"
              ? "border-destructive bg-destructive/5"
              : currentRiskLevel === "moderate"
                ? "border-warning bg-warning/5"
                : "border-success bg-success/5"
          }`}
        >
          <AlertTriangle
            className={`h-4 w-4 ${
              currentRiskLevel === "high"
                ? "text-destructive"
                : currentRiskLevel === "moderate"
                  ? "text-warning"
                  : "text-success"
            }`}
          />
          <AlertDescription>
            {currentRiskLevel === "high"
              ? "Your stability score indicates high risk. Your care team has been notified immediately."
              : currentRiskLevel === "moderate"
                ? "Your stability score indicates moderate risk. Your care team has been notified and will reach out within 24 hours."
                : "Your stability score indicates low risk. Keep up the great work with your health management!"}
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className={`transition-all duration-300 ${isUpdatingRisk ? 'opacity-75 scale-95' : 'opacity-100 scale-100'}`}>
            <RiskScoreCard
              score={currentRiskScore}
              level={currentRiskLevel}
              trend={isUpdatingRisk ? "updating" : "stable"}
              prediction={isUpdatingRisk ? "Updating risk assessment..." : "Low risk of complications in next 48 hours"}
            />
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-destructive" />
                  Blood Pressure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{currentVitals.bloodPressure.value}</span>
                  <Badge variant={currentVitals.bloodPressure.status === "elevated" || currentVitals.bloodPressure.status === "critical" ? "destructive" : "secondary"}>
                    {currentVitals.bloodPressure.status}
                  </Badge>
                </div>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-destructive" />
                  Trending up
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-primary" />
                  Blood Sugar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{currentVitals.bloodSugar.value}</span>
                  <Badge variant={currentVitals.bloodSugar.status === "high" ? "destructive" : "secondary"}>{currentVitals.bloodSugar.status}</Badge>
                </div>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-success" />
                  Stable range
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingDown className="w-4 h-4 mr-2 text-success" />
                  Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{currentVitals.weight.value}</span>
                  <Badge variant="secondary" className={currentVitals.weight.status === "improving" ? "bg-success/10 text-success" : ""} >
                    {currentVitals.weight.status}
                  </Badge>
                </div>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <TrendingDown className="w-3 h-3 mr-1 text-success" />
                  Down 3 lbs this month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-chart-2" />
                  Heart Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{patientData.vitals.heartRate.value}</span>
                  <Badge variant="secondary">{patientData.vitals.heartRate.status}</Badge>
                </div>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Activity className="w-3 h-3 mr-1 text-chart-2" />
                  Resting rate
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* How It Works Info */}
            <NudgesInfo />
            
            {/* Demo Controls */}
            <NudgeDemoControls 
              onScenarioChange={handleScenarioChange}
              currentRiskScore={currentRiskScore}
            />

            {/* Context-Aware Nudges - Priority Section */}
            <div className="mb-8">
              <ContextAwareNudges 
                riskScore={currentRiskScore}
                riskLevel={currentRiskLevel}
                vitals={currentVitals}
                recentLogs={recentLogs}
                loggedVitals={lastLoggedVitals}
              />
            </div>

            {/* Predictive Impact Analysis */}
            <div className="mb-8">
              <PredictiveImpact 
                riskScore={currentRiskScore}
                riskLevel={currentRiskLevel}
                vitals={currentVitals}
                recentLogs={recentLogs}
                loggedVitals={lastLoggedVitals}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Recommendations</h3>
                {recommendations.map((rec, index) => (
                  <RecommendationCard key={index} recommendation={rec} />
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <QuickActions />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Vitals Tracking</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedPeriod("7d")}>
                  7 Days
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedPeriod("30d")}>
                  30 Days
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedPeriod("90d")}>
                  90 Days
                </Button>
              </div>
            </div>
            <VitalsChart period={selectedPeriod} />
          </TabsContent>

          <TabsContent value="medications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Medication Management</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </div>
            <div className="grid gap-4">
              {patientData.medications.map((med, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{med.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {med.dosage} • {med.frequency}
                        </p>
                        <p className="text-sm text-muted-foreground">Next dose: {med.nextDose}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-muted-foreground">Adherence</span>
                          <Badge variant={med.adherence >= 90 ? "secondary" : "destructive"}>{med.adherence}%</Badge>
                        </div>
                        <Progress value={med.adherence} className="w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
              <Button size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>
            <div className="grid gap-4">
              {patientData.upcomingAppointments.map((apt, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{apt.doctor}</h4>
                        <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{apt.date}</p>
                        <p className="text-sm text-muted-foreground">{apt.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <div className="text-center py-12">
              <Brain className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Health Predictions</h3>
              <p className="text-muted-foreground mb-6">
                Get advanced predictive analytics and risk forecasting for proactive care management.
              </p>
              <Button asChild>
                <Link href="/predictions">View Detailed Predictions</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Connect with Your Community</h3>
              <p className="text-muted-foreground mb-6">
                Join support groups and connect with others managing similar conditions.
              </p>
              <Button>Explore Community Forums</Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
