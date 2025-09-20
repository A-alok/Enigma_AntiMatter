"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Heart, 
  Activity, 
  Brain, 
  Droplets, 
  Wind, 
  Apple, 
  Moon, 
  Zap, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Lightbulb
} from "lucide-react"

interface VitalData {
  bloodPressure: { value: string; trend: string; status: string; systolic: number; diastolic: number }
  bloodSugar: { value: string; trend: string; status: string; level: number }
  weight: { value: string; trend: string; status: string; pounds: number }
  heartRate: { value: string; trend: string; status: string; bpm: number }
}

interface NudgeData {
  id: string
  type: 'critical' | 'warning' | 'suggestion' | 'positive'
  category: 'stress' | 'nutrition' | 'activity' | 'medication' | 'sleep' | 'hydration'
  title: string
  message: string
  action?: string
  icon: any
  priority: number
  contextualData?: any
  timeToAct?: string
  impact: 'high' | 'medium' | 'low'
}

interface ContextAwareNudgesProps {
  riskScore: number
  riskLevel: string
  vitals: VitalData
  recentLogs?: any[]
  timeOfDay?: string
  weatherData?: any
  userPreferences?: any
  loggedVitals?: any
}

export function ContextAwareNudges({ 
  riskScore, 
  riskLevel, 
  vitals, 
  recentLogs = [],
  timeOfDay = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
  loggedVitals = null
}: ContextAwareNudgesProps) {
  const [currentNudges, setCurrentNudges] = useState<NudgeData[]>([])
  const [dismissedNudges, setDismissedNudges] = useState<string[]>([])

  // Analyze context and generate personalized nudges
  useEffect(() => {
    const generateNudges = () => {
      const nudges: NudgeData[] = []

      // IMMEDIATE PREDICTIVE NUDGES based on freshly logged vitals
      if (loggedVitals) {
        // Critical intervention from logged BP
        if (loggedVitals.systolic_bp > 150 || loggedVitals.diastolic_bp > 95) {
          nudges.push({
            id: 'logged-bp-emergency',
            type: 'critical',
            category: 'stress',
            title: '🚨 IMMEDIATE ACTION: Blood Pressure Critical',
            message: `Your just-logged BP (${loggedVitals.systolic_bp}/${loggedVitals.diastolic_bp}) requires immediate attention. Stop current activity and breathe deeply.`,
            action: 'Emergency breathing protocol',
            icon: Heart,
            priority: 15,
            timeToAct: '30 seconds',
            impact: 'high'
          })
        }
        
        // High stress intervention from logged data
        if (loggedVitals.stress_level > 8) {
          nudges.push({
            id: 'logged-stress-critical',
            type: 'critical',
            category: 'stress',
            title: '🧠 STRESS ALERT: Immediate Relaxation Needed',
            message: `You logged stress level ${loggedVitals.stress_level}/10. Your body needs immediate stress relief to prevent health complications.`,
            action: 'Start 5-minute calming routine',
            icon: Wind,
            priority: 14,
            timeToAct: '2 minutes',
            impact: 'high'
          })
        }
        
        // Sleep deficit intervention
        if (loggedVitals.sleep_hours < 5) {
          nudges.push({
            id: 'logged-sleep-crisis',
            type: 'warning',
            category: 'sleep',
            title: '😴 SLEEP CRISIS: Recovery Mode Activated',
            message: `Only ${loggedVitals.sleep_hours}h sleep seriously impacts your health. Priority: rest planning and energy conservation today.`,
            action: 'Create recovery plan',
            icon: Moon,
            priority: 13,
            timeToAct: '5 minutes',
            impact: 'high'
          })
        }
        
        // Heart rate intervention
        if (loggedVitals.heart_rate > 110) {
          nudges.push({
            id: 'logged-hr-elevated',
            type: 'critical',
            category: 'activity',
            title: '❤️ HEART RATE ALERT: Immediate Rest',
            message: `HR ${loggedVitals.heart_rate} bpm is significantly elevated. Sit down, breathe slowly, and avoid physical exertion.`,
            action: 'Rest and monitor',
            icon: Heart,
            priority: 14,
            timeToAct: '1 minute',
            impact: 'high'
          })
        }
        
        // Multi-factor risk pattern from logged data
        const loggedRiskFactors = [
          loggedVitals.systolic_bp > 140 ? 1 : 0,
          loggedVitals.heart_rate > 90 ? 1 : 0,
          loggedVitals.stress_level > 6 ? 1 : 0,
          loggedVitals.sleep_hours < 6 ? 1 : 0,
          loggedVitals.fatigue_score > 7 ? 1 : 0
        ].reduce((a, b) => a + b, 0)
        
        if (loggedRiskFactors >= 3) {
          nudges.push({
            id: 'logged-multi-risk',
            type: 'critical',
            category: 'stress',
            title: '⚠️ MULTIPLE RISK PATTERN DETECTED',
            message: `Your vitals show ${loggedRiskFactors} risk factors simultaneously. Comprehensive intervention needed NOW.`,
            action: 'Activate emergency protocols',
            icon: AlertTriangle,
            priority: 16,
            contextualData: { riskCount: loggedRiskFactors, vitals: loggedVitals },
            timeToAct: '2 minutes',
            impact: 'high'
          })
        }
      }

      // High-priority critical nudges based on vitals
      if (vitals.bloodPressure.systolic > 140 || vitals.bloodPressure.diastolic > 90) {
        nudges.push({
          id: 'bp-critical',
          type: 'critical',
          category: 'stress',
          title: 'Blood Pressure Alert',
          message: `Your blood pressure is ${vitals.bloodPressure.value}. Take 5 deep breaths right now and consider a brief meditation.`,
          action: 'Start 2-minute breathing exercise',
          icon: Heart,
          priority: 10,
          timeToAct: '2 minutes',
          impact: 'high'
        })
      } else if (vitals.bloodPressure.systolic > 130) {
        nudges.push({
          id: 'bp-warning',
          type: 'warning',
          category: 'stress',
          title: 'Stress Check-In',
          message: 'Your stress levels seem elevated based on your BP reading. A quick breathing exercise could help.',
          action: 'Try 4-7-8 breathing technique',
          icon: Wind,
          priority: 7,
          timeToAct: '3 minutes',
          impact: 'medium'
        })
      }

      // Blood sugar management
      if (vitals.bloodSugar.level > 180) {
        nudges.push({
          id: 'glucose-high',
          type: 'critical',
          category: 'activity',
          title: 'Blood Sugar Management',
          message: `Your glucose is ${vitals.bloodSugar.value}. A 10-minute walk can help lower it naturally.`,
          action: 'Take a gentle walk',
          icon: Activity,
          priority: 9,
          timeToAct: '10 minutes',
          impact: 'high'
        })
      } else if (vitals.bloodSugar.level > 140) {
        nudges.push({
          id: 'glucose-moderate',
          type: 'suggestion',
          category: 'hydration',
          title: 'Hydration Reminder',
          message: 'Your glucose is slightly elevated. Stay hydrated with water to support healthy levels.',
          action: 'Drink 8oz water',
          icon: Droplets,
          priority: 5,
          timeToAct: '1 minute',
          impact: 'medium'
        })
      }

      // Contextual nutrition nudges based on time and recent logs
      if (timeOfDay === 'morning' && riskScore > 60) {
        nudges.push({
          id: 'morning-nutrition',
          type: 'suggestion',
          category: 'nutrition',
          title: 'Smart Breakfast Choice',
          message: 'Start your day with a protein-rich breakfast to stabilize blood sugar throughout the morning.',
          action: 'Log breakfast',
          icon: Apple,
          priority: 6,
          timeToAct: '15 minutes',
          impact: 'medium'
        })
      }

      // Sodium balance nudge (based on example request)
      const hasHighSodium = recentLogs.some(log => log.sodium && log.sodium > 2000)
      if (hasHighSodium) {
        nudges.push({
          id: 'sodium-balance',
          type: 'warning',
          category: 'nutrition',
          title: 'Sodium Balance Alert',
          message: 'Your last log shows high sodium intake. Balance with potassium-rich foods like bananas or spinach.',
          action: 'Add potassium foods',
          icon: Apple,
          priority: 8,
          contextualData: { sodiumLevel: recentLogs.find(log => log.sodium)?.sodium },
          timeToAct: '5 minutes',
          impact: 'high'
        })
      }

      // Heart rate and activity nudges
      if (vitals.heartRate.bpm > 100 && riskLevel === 'high') {
        nudges.push({
          id: 'heart-rate-calm',
          type: 'critical',
          category: 'stress',
          title: 'Heart Rate Alert',
          message: `Your heart rate is ${vitals.heartRate.value}. Let's bring it down with some calm breathing.`,
          action: 'Start relaxation exercise',
          icon: Heart,
          priority: 9,
          timeToAct: '5 minutes',
          impact: 'high'
        })
      }

      // Weight progress acknowledgment
      if (vitals.weight.trend === 'down') {
        nudges.push({
          id: 'weight-progress',
          type: 'positive',
          category: 'activity',
          title: 'Great Progress!',
          message: 'Your weight trend is improving! Keep up the healthy habits that are working for you.',
          action: 'Log today\'s activities',
          icon: TrendingUp,
          priority: 3,
          timeToAct: '2 minutes',
          impact: 'low'
        })
      }

      // Sleep and recovery (evening nudges)
      if (timeOfDay === 'evening' && riskScore > 50) {
        nudges.push({
          id: 'evening-prep',
          type: 'suggestion',
          category: 'sleep',
          title: 'Prepare for Recovery',
          message: 'Good sleep helps regulate blood sugar and blood pressure. Consider starting your wind-down routine.',
          action: 'Set sleep reminder',
          icon: Moon,
          priority: 4,
          timeToAct: '30 minutes',
          impact: 'medium'
        })
      }

      // Get current time context for various nudges
      const currentHour = new Date().getHours()
      const isWeekend = [0, 6].includes(new Date().getDay())
      
      // Advanced pattern recognition for personalized nudges
      const recentSodiumAvg = recentLogs.reduce((acc, log) => acc + (log.sodium || 0), 0) / Math.max(recentLogs.length, 1)
      const dailyCaloriePattern = recentLogs.reduce((acc, log) => acc + (log.calories || 0), 0)

      // Medication adherence based on time
      if ((currentHour >= 17 && currentHour <= 19) || (currentHour >= 7 && currentHour <= 9)) {
        nudges.push({
          id: 'medication-time',
          type: 'warning',
          category: 'medication',
          title: 'Medication Reminder',
          message: 'It\'s almost time for your scheduled medication. Consistency helps maintain stable levels.',
          action: 'Check medication schedule',
          icon: Clock,
          priority: 8,
          timeToAct: '5 minutes',
          impact: 'high'
        })
      }

      // Predictive nudges based on risk score trends
      if (riskScore > 70) {
        nudges.push({
          id: 'risk-prevention',
          type: 'critical',
          category: 'activity',
          title: 'Prevention Focus',
          message: 'Your risk indicators suggest focusing on immediate stress reduction and gentle movement.',
          action: 'Start prevention routine',
          icon: Shield,
          priority: 10,
          timeToAct: '10 minutes',
          impact: 'high'
        })
      }

      // Smart behavioral pattern nudges
      if (recentSodiumAvg > 2500 && vitals.bloodPressure.systolic > 130) {
        nudges.push({
          id: 'sodium-bp-correlation',
          type: 'warning',
          category: 'nutrition',
          title: 'Pattern Alert: Sodium & Blood Pressure',
          message: `Your average sodium intake is ${Math.round(recentSodiumAvg)}mg/day. This pattern correlates with your elevated BP.`,
          action: 'View sodium reduction plan',
          icon: TrendingUp,
          priority: 9,
          contextualData: { avgSodium: recentSodiumAvg, bpReading: vitals.bloodPressure.value },
          timeToAct: '2 minutes',
          impact: 'high'
        })
      }

      // Meal timing and glucose control
      if (vitals.bloodSugar.level > 160 && dailyCaloriePattern > 2000) {
        nudges.push({
          id: 'meal-timing-glucose',
          type: 'suggestion',
          category: 'nutrition',
          title: 'Optimize Meal Timing',
          message: 'Your glucose levels suggest smaller, more frequent meals may help. Try spacing meals 3-4 hours apart.',
          action: 'Set meal reminders',
          icon: Clock,
          priority: 6,
          timeToAct: '1 minute',
          impact: 'medium'
        })
      }

      // Environmental and contextual nudges
      // Stress-related nudges based on combined indicators
      if (vitals.heartRate.bpm > 85 && vitals.bloodPressure.systolic > 135 && riskScore > 60) {
        nudges.push({
          id: 'stress-intervention',
          type: 'critical',
          category: 'stress',
          title: 'Stress Intervention Needed',
          message: `Your heart rate (${vitals.heartRate.bpm}) and BP suggest acute stress. Try the 4-7-8 breathing technique right now.`,
          action: 'Start guided breathing',
          icon: Wind,
          priority: 10,
          contextualData: { hr: vitals.heartRate.bpm, bp: vitals.bloodPressure.value },
          timeToAct: '3 minutes',
          impact: 'high'
        })
      }

      // Weekend vs weekday activity adaptation
      if (isWeekend && vitals.weight.trend !== 'down' && riskScore > 50) {
        nudges.push({
          id: 'weekend-activity',
          type: 'suggestion',
          category: 'activity',
          title: 'Weekend Movement Opportunity',
          message: 'Weekends are perfect for longer walks or activities. Your body will thank you for the extra movement.',
          action: 'Plan weekend activity',
          icon: Activity,
          priority: 4,
          timeToAct: '5 minutes',
          impact: 'medium'
        })
      }

      // Late night health habits
      if (currentHour >= 22 && (vitals.bloodPressure.systolic > 130 || vitals.bloodSugar.level > 140)) {
        nudges.push({
          id: 'evening-wind-down',
          type: 'suggestion',
          category: 'sleep',
          title: 'Evening Preparation',
          message: 'Late evening is ideal for gentle stretching and avoiding heavy meals. This helps with tomorrow\'s readings.',
          action: 'Start wind-down routine',
          icon: Moon,
          priority: 5,
          timeToAct: '10 minutes',
          impact: 'medium'
        })
      }

      // Hydration with smart timing
      if (timeOfDay === 'afternoon') {
        nudges.push({
          id: 'hydration-afternoon',
          type: 'suggestion',
          category: 'hydration',
          title: 'Afternoon Hydration',
          message: 'Staying hydrated helps maintain healthy blood pressure and supports kidney function.',
          action: 'Track water intake',
          icon: Droplets,
          priority: 2,
          timeToAct: '1 minute',
          impact: 'low'
        })
      }

      // Recovery and positive reinforcement
      if (riskScore < 40 && vitals.bloodPressure.trend === 'down' && vitals.weight.trend === 'down') {
        nudges.push({
          id: 'positive-momentum',
          type: 'positive',
          category: 'activity',
          title: 'Excellent Momentum!',
          message: 'Your BP is trending down and weight is improving. You\'re building sustainable healthy habits!',
          action: 'Log success factors',
          icon: TrendingUp,
          priority: 2,
          timeToAct: '2 minutes',
          impact: 'low'
        })
      }

      // Sort by priority and filter dismissed
      return nudges
        .filter(nudge => !dismissedNudges.includes(nudge.id))
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 6) // Show top 6 most relevant nudges
    }

    setCurrentNudges(generateNudges())
  }, [riskScore, riskLevel, vitals, recentLogs, timeOfDay, dismissedNudges, loggedVitals])

  const handleDismissNudge = (nudgeId: string) => {
    setDismissedNudges(prev => [...prev, nudgeId])
  }

  const handleActionClick = (nudge: NudgeData) => {
    // In a real app, this would trigger specific actions
    console.log(`Action triggered for nudge: ${nudge.id}`)
    handleDismissNudge(nudge.id)
  }

  const getNudgeVariant = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive'
      case 'warning': return 'default'
      case 'positive': return 'default'
      default: return 'secondary'
    }
  }

  const getNudgeColors = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50'
      case 'warning': return 'border-amber-200 bg-amber-50'
      case 'positive': return 'border-green-200 bg-green-50'
      default: return 'border-blue-200 bg-blue-50'
    }
  }

  if (currentNudges.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">You're doing great!</h3>
          <p className="text-muted-foreground">
            All your health indicators look good right now. Keep up the excellent work!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
          Smart Health Nudges
        </h3>
        <Badge variant="secondary" className="text-xs">
          {currentNudges.length} personalized recommendations
        </Badge>
      </div>

      <div className="grid gap-3">
        {currentNudges.map((nudge) => {
          const IconComponent = nudge.icon
          return (
            <Alert key={nudge.id} className={`${getNudgeColors(nudge.type)} transition-all hover:shadow-md`}>
              <div className="flex items-start space-x-3">
                <IconComponent className={`h-5 w-5 mt-0.5 ${
                  nudge.type === 'critical' ? 'text-red-600' :
                  nudge.type === 'warning' ? 'text-amber-600' :
                  nudge.type === 'positive' ? 'text-green-600' :
                  'text-blue-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{nudge.title}</h4>
                    <div className="flex items-center space-x-2">
                      {nudge.timeToAct && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {nudge.timeToAct}
                        </Badge>
                      )}
                      <Badge variant={getNudgeVariant(nudge.type)} className="text-xs">
                        {nudge.impact} impact
                      </Badge>
                    </div>
                  </div>
                  <AlertDescription className="text-sm mb-3">
                    {nudge.message}
                  </AlertDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {nudge.action && (
                        <Button 
                          size="sm" 
                          variant={nudge.type === 'critical' ? 'default' : 'outline'}
                          onClick={() => handleActionClick(nudge)}
                          className="text-xs"
                        >
                          <Target className="w-3 h-3 mr-1" />
                          {nudge.action}
                        </Button>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDismissNudge(nudge.id)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </Alert>
          )
        })}
      </div>

      {/* Context Summary */}
      <Card>
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground">
            <p className="mb-1">
              <strong>Context Analysis:</strong> Risk Score: {riskScore}/100, 
              Time: {timeOfDay}, BP: {vitals.bloodPressure.value}, 
              Glucose: {vitals.bloodSugar.value}
            </p>
            <Progress value={100 - riskScore} className="h-1" />
            <p className="mt-1">
              Recommendations personalized based on your current health metrics and daily patterns.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
