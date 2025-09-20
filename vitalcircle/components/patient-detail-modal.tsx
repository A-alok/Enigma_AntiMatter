"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface PatientDetailModalProps {
  patientId: string
  onClose: () => void
}

export function PatientDetailModal({ patientId, onClose }: PatientDetailModalProps) {
  const [notes, setNotes] = useState("")

  // Mock patient detail data - in real app this would be fetched
  const patientDetail = {
    id: "VC-2025-001234",
    name: "Sarah Johnson",
    age: 45,
    condition: "Type 2 Diabetes",
    riskScore: 45,
    riskLevel: "high",
    diagnosis: "Type 2 Diabetes Mellitus, Hypertension",
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "2x daily", adherence: 95 },
      { name: "Lisinopril", dosage: "10mg", frequency: "1x daily", adherence: 88 },
    ],
    vitals: {
      bloodPressure: "132/88",
      bloodSugar: "165 mg/dL",
      weight: "165 lbs",
      heartRate: "78 bpm",
    },
    recentLabs: [
      { test: "HbA1c", value: "7.2%", date: "2024-12-01", status: "elevated" },
      { test: "Cholesterol", value: "195 mg/dL", date: "2024-12-01", status: "normal" },
      { test: "Creatinine", value: "1.1 mg/dL", date: "2024-12-01", status: "normal" },
    ],
    riskFactors: ["Blood pressure trending upward", "Medication adherence declining", "Weight gain over past month"],
    recommendations: [
      "Increase Lisinopril to 15mg daily",
      "Schedule nutrition counseling",
      "Implement home BP monitoring",
      "Follow-up in 2 weeks",
    ],
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{patientDetail.name} - Detailed View</span>
            <Badge variant="destructive">High Risk</Badge>
          </DialogTitle>
          <DialogDescription>
            {patientDetail.id} • Age {patientDetail.age} • {patientDetail.condition}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vitals">Vitals & Labs</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="interventions">Interventions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-destructive">{patientDetail.riskScore}/100</span>
                      <Badge variant="destructive">High Risk</Badge>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Risk Factors:</h4>
                      {patientDetail.riskFactors.map((factor, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {factor}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Vitals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Blood Pressure</div>
                      <div className="font-semibold text-destructive">{patientDetail.vitals.bloodPressure}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Blood Sugar</div>
                      <div className="font-semibold">{patientDetail.vitals.bloodSugar}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Weight</div>
                      <div className="font-semibold">{patientDetail.vitals.weight}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Heart Rate</div>
                      <div className="font-semibold">{patientDetail.vitals.heartRate}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Lab Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientDetail.recentLabs.map((lab, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{lab.test}</div>
                        <div className="text-sm text-muted-foreground">{lab.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{lab.value}</div>
                        <Badge variant={lab.status === "elevated" ? "destructive" : "secondary"} className="text-xs">
                          {lab.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientDetail.medications.map((med, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{med.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {med.dosage} • {med.frequency}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{med.adherence}%</div>
                        <div className="text-xs text-muted-foreground">Adherence</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interventions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientDetail.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">{rec}</span>
                      <Button size="sm" variant="outline">
                        Implement
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clinical Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Add Clinical Note</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter clinical observations, treatment plans, or follow-up notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm">Save Note</Button>
                    <Button size="sm" variant="outline">
                      Schedule Follow-up
                    </Button>
                    <Button size="sm" variant="outline">
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
