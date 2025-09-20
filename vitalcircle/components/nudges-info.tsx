"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Lightbulb,
  Heart,
  Activity,
  Droplets,
  Clock,
  Apple
} from "lucide-react"

export function NudgesInfo() {
  const nudgeTypes = [
    {
      category: "Critical Interventions",
      color: "text-red-600 bg-red-50 border-red-200",
      examples: [
        "Blood pressure crisis (>140/90) → Immediate breathing exercises",
        "High glucose spike (>180) → Gentle movement recommendation",
        "Acute stress pattern → Emergency relaxation techniques"
      ],
      icon: Heart
    },
    {
      category: "Pattern Recognition",
      color: "text-amber-600 bg-amber-50 border-amber-200",
      examples: [
        "High sodium intake correlating with elevated BP",
        "Meal timing affecting glucose control",
        "Multi-day behavioral patterns"
      ],
      icon: TrendingUp
    },
    {
      category: "Contextual Suggestions",
      color: "text-blue-600 bg-blue-50 border-blue-200",
      examples: [
        "Morning nutrition based on risk score",
        "Weekend activity opportunities",
        "Evening wind-down routines"
      ],
      icon: Clock
    },
    {
      category: "Positive Reinforcement",
      color: "text-green-600 bg-green-50 border-green-200",
      examples: [
        "Weight loss progress acknowledgment",
        "Blood pressure improvements",
        "Momentum building encouragement"
      ],
      icon: Target
    }
  ]

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-base">
          <Brain className="w-5 h-5 mr-2 text-purple-600" />
          How Context-Aware Nudges Work
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 border-blue-200 bg-blue-50">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <strong>Smart Health Nudges</strong> analyze your risk score, vital signs, recent logs, and time patterns to provide hyper-personalized recommendations exactly when you need them most.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-4">
          {nudgeTypes.map((type, index) => {
            const IconComponent = type.icon
            return (
              <Card key={index} className={`${type.color}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <IconComponent className="w-4 h-4 mr-2" />
                    {type.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1 text-xs">
                    {type.examples.map((example, exIndex) => (
                      <li key={exIndex} className="flex items-start">
                        <span className="w-1 h-1 bg-current rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="text-center p-2 bg-muted/50 rounded">
            <Heart className="w-4 h-4 mx-auto mb-1 text-red-500" />
            <div className="font-semibold">Vitals Analysis</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <Activity className="w-4 h-4 mx-auto mb-1 text-blue-500" />
            <div className="font-semibold">Behavioral Patterns</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <Clock className="w-4 h-4 mx-auto mb-1 text-purple-500" />
            <div className="font-semibold">Time Context</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <Apple className="w-4 h-4 mx-auto mb-1 text-green-500" />
            <div className="font-semibold">Nutrition Tracking</div>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            <strong>Try the demo scenarios above</strong> to see how nudges adapt to different health contexts. 
            Each scenario triggers different algorithms based on risk factors, vital sign combinations, and behavioral patterns.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
