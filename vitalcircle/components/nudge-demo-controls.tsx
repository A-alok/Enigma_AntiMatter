"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Heart, 
  Activity, 
  Droplets, 
  AlertTriangle, 
  TrendingUp,
  Clock
} from "lucide-react"

interface NudgeDemoControlsProps {
  onScenarioChange: (scenario: any) => void
  currentRiskScore: number
}

export function NudgeDemoControls({ onScenarioChange, currentRiskScore }: NudgeDemoControlsProps) {
  const scenarios = [
    {
      name: "High Blood Pressure Crisis",
      description: "Simulate elevated BP readings",
      riskScore: 85,
      vitals: {
        bloodPressure: { value: "156/98", trend: "up", status: "critical", systolic: 156, diastolic: 98 },
        bloodSugar: { value: "145 mg/dL", trend: "stable", status: "normal", level: 145 },
        weight: { value: "165 lbs", trend: "stable", status: "normal", pounds: 165 },
        heartRate: { value: "95 bpm", trend: "up", status: "elevated", bpm: 95 }
      },
      logs: [{ sodium: 3200, calories: 800, timestamp: new Date().toISOString() }],
      icon: Heart,
      color: "text-red-600"
    },
    {
      name: "High Blood Sugar Alert",
      description: "Glucose spike scenario",
      riskScore: 75,
      vitals: {
        bloodPressure: { value: "135/85", trend: "stable", status: "elevated", systolic: 135, diastolic: 85 },
        bloodSugar: { value: "195 mg/dL", trend: "up", status: "high", level: 195 },
        weight: { value: "165 lbs", trend: "stable", status: "normal", pounds: 165 },
        heartRate: { value: "88 bpm", trend: "stable", status: "normal", bpm: 88 }
      },
      logs: [{ sodium: 1800, calories: 1200, timestamp: new Date().toISOString() }],
      icon: Activity,
      color: "text-orange-600"
    },
    {
      name: "High Sodium Intake",
      description: "Excessive sodium consumption",
      riskScore: 65,
      vitals: {
        bloodPressure: { value: "140/88", trend: "up", status: "elevated", systolic: 140, diastolic: 88 },
        bloodSugar: { value: "150 mg/dL", trend: "stable", status: "normal", level: 150 },
        weight: { value: "167 lbs", trend: "up", status: "concern", pounds: 167 },
        heartRate: { value: "82 bpm", trend: "stable", status: "normal", bpm: 82 }
      },
      logs: [{ sodium: 4500, calories: 900, timestamp: new Date().toISOString() }],
      icon: Droplets,
      color: "text-blue-600"
    },
    {
      name: "Excellent Health Day",
      description: "All metrics optimal",
      riskScore: 25,
      vitals: {
        bloodPressure: { value: "118/75", trend: "down", status: "optimal", systolic: 118, diastolic: 75 },
        bloodSugar: { value: "105 mg/dL", trend: "stable", status: "optimal", level: 105 },
        weight: { value: "162 lbs", trend: "down", status: "improving", pounds: 162 },
        heartRate: { value: "65 bpm", trend: "stable", status: "excellent", bpm: 65 }
      },
      logs: [{ sodium: 1200, calories: 500, exercise: '45min walk', timestamp: new Date().toISOString() }],
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      name: "Evening Medication Time",
      description: "Simulate medication reminder context",
      riskScore: 55,
      vitals: {
        bloodPressure: { value: "130/82", trend: "stable", status: "elevated", systolic: 130, diastolic: 82 },
        bloodSugar: { value: "140 mg/dL", trend: "stable", status: "normal", level: 140 },
        weight: { value: "165 lbs", trend: "stable", status: "normal", pounds: 165 },
        heartRate: { value: "78 bpm", trend: "stable", status: "normal", bpm: 78 }
      },
      logs: [{ sodium: 2000, calories: 600, timestamp: new Date().toISOString() }],
      icon: Clock,
      color: "text-purple-600"
    },
    {
      name: "Acute Stress Pattern",
      description: "Combined stress indicators",
      riskScore: 80,
      vitals: {
        bloodPressure: { value: "145/92", trend: "up", status: "elevated", systolic: 145, diastolic: 92 },
        bloodSugar: { value: "165 mg/dL", trend: "up", status: "high", level: 165 },
        weight: { value: "168 lbs", trend: "up", status: "concern", pounds: 168 },
        heartRate: { value: "95 bpm", trend: "up", status: "elevated", bpm: 95 }
      },
      logs: [
        { sodium: 3800, calories: 900, timestamp: new Date().toISOString() },
        { sodium: 3200, calories: 750, timestamp: new Date(Date.now() - 3600000).toISOString() }
      ],
      icon: AlertTriangle,
      color: "text-red-700"
    },
    {
      name: "Pattern Recognition Demo",
      description: "Multi-day sodium & BP correlation",
      riskScore: 70,
      vitals: {
        bloodPressure: { value: "138/88", trend: "up", status: "elevated", systolic: 138, diastolic: 88 },
        bloodSugar: { value: "155 mg/dL", trend: "stable", status: "normal", level: 155 },
        weight: { value: "166 lbs", trend: "stable", status: "normal", pounds: 166 },
        heartRate: { value: "82 bpm", trend: "stable", status: "normal", bpm: 82 }
      },
      logs: [
        { sodium: 2800, calories: 650, timestamp: new Date().toISOString() },
        { sodium: 3100, calories: 720, timestamp: new Date(Date.now() - 3600000).toISOString() },
        { sodium: 2900, calories: 680, timestamp: new Date(Date.now() - 7200000).toISOString() }
      ],
      icon: TrendingUp,
      color: "text-amber-600"
    }
  ]

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-base">
          <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
          Demo Controls - Test Context-Aware Nudges
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Try different health scenarios to see how nudges adapt to context
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span>Current Risk Score:</span>
            <Badge variant={currentRiskScore > 70 ? "destructive" : currentRiskScore > 40 ? "default" : "secondary"}>
              {currentRiskScore}/100
            </Badge>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {scenarios.map((scenario, index) => {
            const IconComponent = scenario.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-shadow"
                onClick={() => onScenarioChange({
                  riskScore: scenario.riskScore,
                  riskLevel: scenario.riskScore > 70 ? 'high' : scenario.riskScore > 40 ? 'moderate' : 'low',
                  vitals: scenario.vitals,
                  logs: scenario.logs
                })}
              >
                <div className="flex items-center space-x-2 w-full">
                  <IconComponent className={`w-4 h-4 ${scenario.color}`} />
                  <Badge 
                    variant={scenario.riskScore > 70 ? "destructive" : scenario.riskScore > 40 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {scenario.riskScore}
                  </Badge>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">{scenario.name}</div>
                  <div className="text-xs text-muted-foreground">{scenario.description}</div>
                </div>
              </Button>
            )
          })}
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          💡 Each scenario will trigger different nudges based on the specific health context and risk factors.
        </div>
      </CardContent>
    </Card>
  )
}
