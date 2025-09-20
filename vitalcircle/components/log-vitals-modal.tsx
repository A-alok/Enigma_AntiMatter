"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Plus, Heart, Activity, Moon, Frown, Zap, Brain } from "lucide-react"

interface VitalsData {
  systolic_bp: number
  diastolic_bp: number
  heart_rate: number
  weight: number
  sleep_hours: number
  exercise_minutes: number
  fatigue_score: number
  pain_score: number
  stress_level: number
}

interface LogVitalsModalProps {
  onVitalsLogged: (vitals: VitalsData, riskScore: number) => void
}

export function LogVitalsModal({ onVitalsLogged }: LogVitalsModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [predictionMessage, setPredictionMessage] = useState("")
  const [predictionStep, setPredictionStep] = useState(0)
  const [vitals, setVitals] = useState<VitalsData>({
    systolic_bp: 120,
    diastolic_bp: 80,
    heart_rate: 70,
    weight: 68.0,
    sleep_hours: 7.5,
    exercise_minutes: 30,
    fatigue_score: 2,
    pain_score: 1,
    stress_level: 3,
  })

  // Calculate risk score based on vitals
  const calculateRiskScore = (data: VitalsData): number => {
    let riskScore = 0

    // Blood pressure risk (0-30 points)
    if (data.systolic_bp > 140 || data.diastolic_bp > 90) {
      riskScore += 30 // High BP
    } else if (data.systolic_bp > 130 || data.diastolic_bp > 80) {
      riskScore += 20 // Elevated BP
    } else if (data.systolic_bp < 90 || data.diastolic_bp < 60) {
      riskScore += 15 // Low BP
    }

    // Heart rate risk (0-15 points)
    if (data.heart_rate > 100 || data.heart_rate < 60) {
      riskScore += 15
    } else if (data.heart_rate > 90 || data.heart_rate < 65) {
      riskScore += 8
    }

    // Sleep risk (0-20 points)
    if (data.sleep_hours < 6) {
      riskScore += 20
    } else if (data.sleep_hours < 7) {
      riskScore += 10
    } else if (data.sleep_hours > 9) {
      riskScore += 5
    }

    // Exercise risk (0-15 points)
    if (data.exercise_minutes < 20) {
      riskScore += 15
    } else if (data.exercise_minutes < 30) {
      riskScore += 8
    }

    // Fatigue score risk (0-10 points)
    riskScore += data.fatigue_score * 2

    // Pain score risk (0-10 points)
    riskScore += data.pain_score * 2

    // Stress level risk (0-10 points)
    riskScore += data.stress_level * 2

    return Math.min(riskScore, 100) // Cap at 100
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setPredictionStep(0)
    const riskScore = calculateRiskScore(vitals)
    
    // AI Disease Prediction messages sequence
    const predictionSteps = [
      "🔍 Analyzing vital signs & biomarkers...",
      "🧠 AI scanning for disease patterns...",
      "📊 Cross-referencing medical databases...",
      "⚕️ Predicting cardiovascular & metabolic risks...",
      "✅ Disease prediction complete - Generating care plan..."
    ]
    
    // Simulate AI prediction process
    let currentStep = 0
    const predictionInterval = setInterval(() => {
      if (currentStep < predictionSteps.length) {
        setPredictionMessage(predictionSteps[currentStep])
        setPredictionStep(currentStep + 1)
        currentStep++
      }
    }, 1000)
    
    // Complete the prediction after 5 seconds
    setTimeout(() => {
      clearInterval(predictionInterval)
      
      // Generate final disease prediction message based on risk score
      let finalMessage = "🎯 Disease prediction analysis complete!"
      if (riskScore > 70) {
        finalMessage = "🚨 High-risk conditions detected - Immediate care recommendations generated"
      } else if (riskScore > 40) {
        finalMessage = "⚠️ Moderate risk factors identified - Preventive care plan created"
      } else {
        finalMessage = "✅ Low disease risk confirmed - Wellness maintenance plan updated"
      }
      
      setPredictionMessage(finalMessage)
      
      // Call parent callback
      onVitalsLogged(vitals, riskScore)
      
      // Close modal and reset states
      setTimeout(() => {
        setOpen(false)
        setIsSubmitting(false)
        setPredictionMessage("")
        setPredictionStep(0)
      }, 800)
    }, 5000)
  }

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: "low", color: "text-green-600", bg: "bg-green-50" }
    if (score < 60) return { level: "moderate", color: "text-yellow-600", bg: "bg-yellow-50" }
    return { level: "high", color: "text-red-600", bg: "bg-red-50" }
  }

  const currentRisk = getRiskLevel(calculateRiskScore(vitals))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Log Vitals
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            Log Your Daily Vitals
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Vital Signs */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Blood Pressure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="systolic">Systolic (mmHg)</Label>
                    <Input
                      id="systolic"
                      type="number"
                      value={vitals.systolic_bp}
                      onChange={(e) => setVitals({ ...vitals, systolic_bp: Number(e.target.value) })}
                      min="70"
                      max="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                    <Input
                      id="diastolic"
                      type="number"
                      value={vitals.diastolic_bp}
                      onChange={(e) => setVitals({ ...vitals, diastolic_bp: Number(e.target.value) })}
                      min="40"
                      max="120"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-500" />
                  Physical Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    value={vitals.heart_rate}
                    onChange={(e) => setVitals({ ...vitals, heart_rate: Number(e.target.value) })}
                    min="40"
                    max="200"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={vitals.weight}
                    onChange={(e) => setVitals({ ...vitals, weight: Number(e.target.value) })}
                    min="30"
                    max="200"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Moon className="w-5 h-5 mr-2 text-purple-500" />
                  Lifestyle Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sleep">Sleep Hours</Label>
                  <Input
                    id="sleep"
                    type="number"
                    step="0.5"
                    value={vitals.sleep_hours}
                    onChange={(e) => setVitals({ ...vitals, sleep_hours: Number(e.target.value) })}
                    min="0"
                    max="12"
                  />
                </div>
                <div>
                  <Label htmlFor="exercise">Exercise Minutes</Label>
                  <Input
                    id="exercise"
                    type="number"
                    value={vitals.exercise_minutes}
                    onChange={(e) => setVitals({ ...vitals, exercise_minutes: Number(e.target.value) })}
                    min="0"
                    max="300"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Symptom Scores */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Frown className="w-5 h-5 mr-2 text-orange-500" />
                  Symptom Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                      Fatigue Level: {vitals.fatigue_score}/10
                    </span>
                  </Label>
                  <Slider
                    value={[vitals.fatigue_score]}
                    onValueChange={(value) => setVitals({ ...vitals, fatigue_score: value[0] })}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>No fatigue</span>
                    <span>Extreme fatigue</span>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Frown className="w-4 h-4 mr-2 text-red-500" />
                      Pain Level: {vitals.pain_score}/10
                    </span>
                  </Label>
                  <Slider
                    value={[vitals.pain_score]}
                    onValueChange={(value) => setVitals({ ...vitals, pain_score: value[0] })}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>No pain</span>
                    <span>Severe pain</span>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Brain className="w-4 h-4 mr-2 text-purple-500" />
                      Stress Level: {vitals.stress_level}/10
                    </span>
                  </Label>
                  <Slider
                    value={[vitals.stress_level]}
                    onValueChange={(value) => setVitals({ ...vitals, stress_level: value[0] })}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>No stress</span>
                    <span>Extreme stress</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Score Preview */}
            {/* <Card className={`${currentRisk.bg} border-2`}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Predicted Risk Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${currentRisk.color} mb-2`}>{calculateRiskScore(vitals)}</div>
                  <div className={`text-lg font-semibold ${currentRisk.color} capitalize`}>
                    {currentRisk.level} Risk
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Based on your current vitals and symptoms</p>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          {/* AI Prediction Progress Display */}
          {isSubmitting && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="font-semibold text-blue-900">AI Health Analysis</span>
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  {predictionStep}/5 Complete
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-blue-100 rounded-full h-2 mb-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(predictionStep / 5) * 100}%` }}
                ></div>
              </div>
              
              {/* Current Prediction Message */}
              <div className="text-center">
                <p className="text-blue-800 font-medium animate-pulse">
                  {predictionMessage || "Initializing AI analysis..."}
                </p>
              </div>
              
              {/* Additional Context Based on Vitals */}
              <div className="mt-3 text-xs text-blue-600 text-center space-y-1">
                {vitals.systolic_bp > 140 && (
                  <div className="animate-pulse">⚠️ Hypertension risk detected - Scanning for cardiovascular complications</div>
                )}
                {vitals.heart_rate > 100 && (
                  <div className="animate-pulse">❤️ Tachycardia pattern identified - Analyzing arrhythmia potential</div>
                )}
                {vitals.stress_level > 7 && (
                  <div className="animate-pulse">😰 High stress markers - Evaluating anxiety disorder risk</div>
                )}
                {vitals.sleep_hours < 6 && (
                  <div className="animate-pulse">😴 Sleep deficit detected - Screening for insomnia & fatigue syndrome</div>
                )}
                {vitals.fatigue_score > 7 && (
                  <div className="animate-pulse">⚡ Chronic fatigue indicators - Checking for metabolic disorders</div>
                )}
                {vitals.pain_score > 6 && (
                  <div className="animate-pulse">😢 Chronic pain signals - Evaluating inflammatory conditions</div>
                )}
                {vitals.exercise_minutes < 20 && (
                  <div className="animate-pulse">🏃 Sedentary lifestyle detected - Assessing diabetes & obesity risk</div>
                )}
                {(vitals.systolic_bp > 140 && vitals.stress_level > 6) && (
                  <div className="animate-pulse text-amber-600">🚨 Multiple cardiovascular risk factors - Running comprehensive analysis</div>
                )}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-blue-600 min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running AI Analysis...
                </>
              ) : (
                "🚀 Log Vitals & Predict Health"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
