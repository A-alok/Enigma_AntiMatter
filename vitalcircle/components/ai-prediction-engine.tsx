"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"

const predictionData = [
  { date: "2024-01-01", stability: 85, risk: 15, confidence: 92 },
  { date: "2024-01-02", stability: 82, risk: 18, confidence: 89 },
  { date: "2024-01-03", stability: 78, risk: 22, confidence: 87 },
  { date: "2024-01-04", stability: 75, risk: 25, confidence: 85 },
  { date: "2024-01-05", stability: 72, risk: 28, confidence: 83 },
  { date: "2024-01-06", stability: 69, risk: 31, confidence: 81 },
  { date: "2024-01-07", stability: 65, risk: 35, confidence: 78 },
]

const riskFactors = [
  {
    factor: "Blood Pressure Trend",
    impact: 35,
    status: "high",
    description: "Increasing systolic readings over 3 days",
  },
  { factor: "Medication Adherence", impact: 28, status: "medium", description: "Missed 2 doses this week" },
  { factor: "Sleep Quality", impact: 22, status: "medium", description: "Average 5.2 hours per night" },
  { factor: "Stress Levels", impact: 15, status: "low", description: "Self-reported stress increasing" },
]

const aiInsights = [
  {
    type: "prediction",
    title: "Hypertensive Episode Risk",
    probability: 68,
    timeframe: "48 hours",
    confidence: 85,
    description: "Based on current BP trends and medication adherence patterns",
  },
  {
    type: "recommendation",
    title: "Immediate Action Required",
    probability: 92,
    timeframe: "Now",
    confidence: 94,
    description: "Contact healthcare provider for medication adjustment",
  },
  {
    type: "trend",
    title: "Stability Decline",
    probability: 75,
    timeframe: "7 days",
    confidence: 88,
    description: "Overall health stability showing downward trend",
  },
]

export function AIPredictionEngine() {
  const [currentStability, setCurrentStability] = useState(72)
  const [riskLevel, setRiskLevel] = useState(28)
  const [confidence, setConfidence] = useState(83)

  const getRiskColor = (risk: number) => {
    if (risk < 20) return "text-green-500"
    if (risk < 40) return "text-yellow-500"
    return "text-red-500"
  }

  const getRiskBadgeColor = (status: string) => {
    switch (status) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Engine Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Prediction Engine</CardTitle>
              <CardDescription>Advanced risk assessment and health forecasting</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stability Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-blue-600">{currentStability}%</div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={currentStability} className="mt-3" />
            <p className="text-sm text-muted-foreground mt-2">Stable condition maintained</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className={`text-3xl font-bold ${getRiskColor(riskLevel)}`}>{riskLevel}%</div>
              <AlertTriangle className={`h-8 w-8 ${getRiskColor(riskLevel)}`} />
            </div>
            <Progress value={riskLevel} className="mt-3" />
            <p className="text-sm text-muted-foreground mt-2">Moderate risk detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">{confidence}%</div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={confidence} className="mt-3" />
            <p className="text-sm text-muted-foreground mt-2">High prediction accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="factors">Risk Factors</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid gap-4">
            {aiInsights.map((insight, index) => (
              <Card key={index} className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      {insight.timeframe}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Probability</span>
                          <span className="text-sm font-bold text-purple-600">{insight.probability}%</span>
                        </div>
                        <Progress value={insight.probability} className="h-2" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Confidence</span>
                          <span className="text-sm font-bold text-green-600">{insight.confidence}%</span>
                        </div>
                        <Progress value={insight.confidence} className="h-2" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="factors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Factor Analysis</CardTitle>
              <CardDescription>Contributing factors to current risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{factor.factor}</h4>
                        <Badge className={getRiskBadgeColor(factor.status)}>{factor.status} impact</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{factor.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{factor.impact}%</div>
                      <div className="text-sm text-muted-foreground">impact</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Prediction Trend</CardTitle>
              <CardDescription>Stability score and risk level forecasting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="stability"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      name="Stability Score"
                    />
                    <Area
                      type="monotone"
                      dataKey="risk"
                      stackId="2"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                      name="Risk Level"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Confidence Levels</CardTitle>
              <CardDescription>Prediction accuracy over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="confidence" fill="#10b981" name="Confidence %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Recommendations */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <div>
              <CardTitle className="text-lg text-orange-800">Immediate Actions Required</CardTitle>
              <CardDescription className="text-orange-700">AI-recommended interventions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Contact healthcare provider within 24 hours</span>
              </div>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                Schedule Call
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Monitor blood pressure twice daily</span>
              </div>
              <Button size="sm" variant="outline">
                Set Reminder
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
