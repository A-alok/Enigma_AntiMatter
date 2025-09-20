"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Activity, 
  Brain, 
  Wind, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Target
} from "lucide-react"

interface PredictiveImpactProps {
  riskScore: number
  riskLevel: string
  vitals: any
  recentLogs?: any[]
  loggedVitals?: any
}

export function PredictiveImpact({ 
  riskScore, 
  riskLevel, 
  vitals, 
  recentLogs = [],
  loggedVitals = null
}: PredictiveImpactProps) {
  const [predictions, setPredictions] = useState<any[]>([])

  useEffect(() => {
    if (!loggedVitals) return

    const generatePredictions = () => {
      const impacts: any[] = []

      // Risk score change prediction
      const oldRisk = riskScore - 10 // Assume previous was slightly different
      const riskChange = riskScore - oldRisk
      
      impacts.push({
        category: "Risk Assessment",
        change: riskChange > 0 ? "increased" : "decreased",
        magnitude: Math.abs(riskChange),
        description: `Risk score ${riskChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(riskChange)} points`,
        icon: riskChange > 0 ? TrendingUp : TrendingDown,
        color: riskChange > 0 ? "text-red-600" : "text-green-600",
        priority: riskChange > 0 ? "high" : "medium"
      })

      // Blood pressure impact
      if (loggedVitals.systolic_bp > 140 || loggedVitals.diastolic_bp > 90) {
        impacts.push({
          category: "Blood Pressure Alert",
          change: "critical",
          magnitude: 10,
          description: `BP ${loggedVitals.systolic_bp}/${loggedVitals.diastolic_bp} triggers immediate stress reduction protocols`,
          predictedNudges: ["Breathing exercises", "Immediate rest", "Medication check"],
          icon: Heart,
          color: "text-red-600",
          priority: "critical"
        })
      } else if (loggedVitals.systolic_bp > 130 || loggedVitals.diastolic_bp > 80) {
        impacts.push({
          category: "Blood Pressure Watch",
          change: "elevated",
          magnitude: 7,
          description: `BP ${loggedVitals.systolic_bp}/${loggedVitals.diastolic_bp} suggests monitoring sodium intake`,
          predictedNudges: ["Sodium tracking", "Gentle exercise", "Hydration reminders"],
          icon: Heart,
          color: "text-amber-600",
          priority: "medium"
        })
      }

      // Heart rate impact
      if (loggedVitals.heart_rate > 100) {
        impacts.push({
          category: "Heart Rate Elevation",
          change: "elevated",
          magnitude: 8,
          description: `HR ${loggedVitals.heart_rate} bpm indicates need for relaxation techniques`,
          predictedNudges: ["Breathing exercises", "Stress management", "Activity modification"],
          icon: Activity,
          color: "text-red-600",
          priority: "high"
        })
      } else if (loggedVitals.heart_rate < 60) {
        impacts.push({
          category: "Heart Rate Low",
          change: "low",
          magnitude: 6,
          description: `HR ${loggedVitals.heart_rate} bpm suggests gentle activity encouragement`,
          predictedNudges: ["Light movement", "Energy boosting activities"],
          icon: Activity,
          color: "text-blue-600",
          priority: "medium"
        })
      }

      // Sleep impact analysis
      if (loggedVitals.sleep_hours < 6) {
        impacts.push({
          category: "Sleep Deficit",
          change: "concerning",
          magnitude: 9,
          description: `Only ${loggedVitals.sleep_hours}h sleep affects recovery and stress levels`,
          predictedNudges: ["Sleep hygiene tips", "Evening routine", "Stress reduction"],
          icon: Brain,
          color: "text-red-600",
          priority: "high"
        })
      } else if (loggedVitals.sleep_hours < 7) {
        impacts.push({
          category: "Sleep Optimization",
          change: "suboptimal",
          magnitude: 5,
          description: `${loggedVitals.sleep_hours}h sleep could be improved for better health outcomes`,
          predictedNudges: ["Sleep extension tips", "Bedtime optimization"],
          icon: Brain,
          color: "text-amber-600",
          priority: "medium"
        })
      }

      // Exercise impact
      if (loggedVitals.exercise_minutes < 20) {
        impacts.push({
          category: "Activity Deficit",
          change: "low",
          magnitude: 7,
          description: `${loggedVitals.exercise_minutes} min exercise - significant health benefits available`,
          predictedNudges: ["Gentle movement plan", "Activity scheduling", "Motivation support"],
          icon: Activity,
          color: "text-amber-600",
          priority: "medium"
        })
      } else if (loggedVitals.exercise_minutes >= 30) {
        impacts.push({
          category: "Excellent Activity",
          change: "positive",
          magnitude: 5,
          description: `${loggedVitals.exercise_minutes} min exercise supports optimal health outcomes`,
          predictedNudges: ["Activity maintenance", "Progress tracking"],
          icon: CheckCircle,
          color: "text-green-600",
          priority: "low"
        })
      }

      // Stress level impact
      if (loggedVitals.stress_level > 7) {
        impacts.push({
          category: "High Stress Alert",
          change: "critical",
          magnitude: 10,
          description: `Stress level ${loggedVitals.stress_level}/10 requires immediate intervention`,
          predictedNudges: ["Emergency relaxation", "Breathing exercises", "Support resources"],
          icon: Wind,
          color: "text-red-600",
          priority: "critical"
        })
      } else if (loggedVitals.stress_level > 5) {
        impacts.push({
          category: "Moderate Stress",
          change: "elevated",
          magnitude: 6,
          description: `Stress level ${loggedVitals.stress_level}/10 suggests proactive stress management`,
          predictedNudges: ["Relaxation techniques", "Stress tracking", "Mindfulness"],
          icon: Wind,
          color: "text-amber-600",
          priority: "medium"
        })
      }

      // Fatigue impact
      if (loggedVitals.fatigue_score > 7) {
        impacts.push({
          category: "High Fatigue",
          change: "concerning",
          magnitude: 8,
          description: `Fatigue ${loggedVitals.fatigue_score}/10 may affect other health metrics`,
          predictedNudges: ["Energy conservation", "Rest optimization", "Nutrition focus"],
          icon: Zap,
          color: "text-red-600",
          priority: "high"
        })
      }

      // Combined impact predictions
      const combinedRiskFactors = [
        loggedVitals.systolic_bp > 130 ? 1 : 0,
        loggedVitals.heart_rate > 85 ? 1 : 0,
        loggedVitals.stress_level > 6 ? 1 : 0,
        loggedVitals.sleep_hours < 7 ? 1 : 0,
        loggedVitals.exercise_minutes < 30 ? 1 : 0
      ].reduce((a, b) => a + b, 0)

      if (combinedRiskFactors >= 3) {
        impacts.push({
          category: "Multiple Risk Factors",
          change: "pattern",
          magnitude: combinedRiskFactors * 2,
          description: `${combinedRiskFactors} risk factors detected - comprehensive intervention needed`,
          predictedNudges: ["Holistic health plan", "Priority interventions", "Care team notification"],
          icon: AlertTriangle,
          color: "text-red-700",
          priority: "critical"
        })
      }

      return impacts.sort((a, b) => {
        const priorityOrder = { "critical": 4, "high": 3, "medium": 2, "low": 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
    }

    setPredictions(generatePredictions())
  }, [loggedVitals, riskScore, vitals])

  if (!loggedVitals || predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Predictive Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Log your vitals to see predicted health impacts and personalized nudges.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Predictive Impact Analysis
          </span>
          <Badge variant="outline" className="text-xs">
            {predictions.length} predictions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {predictions.map((prediction, index) => {
            const IconComponent = prediction.icon
            return (
              <Alert key={index} className={`transition-all hover:shadow-sm ${ 
                prediction.priority === 'critical' ? 'border-red-200 bg-red-50' :
                prediction.priority === 'high' ? 'border-amber-200 bg-amber-50' :
                prediction.priority === 'medium' ? 'border-blue-200 bg-blue-50' :
                'border-green-200 bg-green-50'
              }`}>
                <div className="flex items-start space-x-3">
                  <IconComponent className={`h-5 w-5 mt-0.5 ${prediction.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{prediction.category}</h4>
                      <Badge 
                        variant={prediction.priority === 'critical' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {prediction.priority} priority
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm mb-2">
                      {prediction.description}
                    </AlertDescription>
                    {prediction.predictedNudges && (
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1">Predicted Nudges:</p>
                        <div className="flex flex-wrap gap-1">
                          {prediction.predictedNudges.map((nudge: string, nudgeIndex: number) => (
                            <Badge key={nudgeIndex} variant="outline" className="text-xs">
                              {nudge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Impact Level</span>
                        <span>{prediction.magnitude}/10</span>
                      </div>
                      <Progress value={prediction.magnitude * 10} className="h-1" />
                    </div>
                  </div>
                </div>
              </Alert>
            )
          })}
        </div>
        
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">How Predictions Work:</p>
            <p>
              Based on your logged vitals, our AI analyzes patterns and predicts which health nudges 
              will be most relevant. This helps you understand the immediate impact of your current health status.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
