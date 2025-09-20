"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
} from "recharts"
import { Brain, Activity } from "lucide-react"

export function RiskAnalyticsDashboard() {
  // Risk score trend data
  const riskTrendData = [
    { date: "Nov 15", score: 85, prediction: 82, factors: 3 },
    { date: "Nov 20", score: 78, prediction: 75, factors: 2 },
    { date: "Nov 25", score: 72, prediction: 70, factors: 2 },
    { date: "Nov 30", score: 68, prediction: 65, factors: 3 },
    { date: "Dec 5", score: 58, prediction: 55, factors: 4 },
    { date: "Dec 10", score: 45, prediction: 48, factors: 5 },
    { date: "Dec 15", score: 52, prediction: 50, factors: 4 },
  ]

  // Risk factor breakdown
  const riskFactors = [
    { name: "Blood Pressure", value: 35, color: "hsl(var(--destructive))" },
    { name: "Medication Adherence", value: 25, color: "hsl(var(--warning))" },
    { name: "Lifestyle Factors", value: 20, color: "hsl(var(--chart-3))" },
    { name: "Stress Levels", value: 15, color: "hsl(var(--chart-4))" },
    { name: "Sleep Quality", value: 5, color: "hsl(var(--chart-5))" },
  ]

  // Intervention effectiveness
  const interventionData = [
    { intervention: "Medication Adjustment", success: 85 },
    { intervention: "Lifestyle Coaching", success: 72 },
    { intervention: "Stress Management", success: 68 },
    { intervention: "Sleep Optimization", success: 61 },
  ]

  // Predictive model accuracy
  const modelAccuracy = [
    { timeframe: "24h", accuracy: 94 },
    { timeframe: "48h", accuracy: 87 },
    { timeframe: "7d", accuracy: 78 },
    { timeframe: "30d", accuracy: 65 },
  ]

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="space-y-6">
      {/* Risk Score Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-primary" />
            AI Risk Score Analysis
          </CardTitle>
          <CardDescription>Stability score trends with AI predictions and actual outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="prediction"
                stackId="1"
                stroke="hsl(var(--muted-foreground))"
                fill="hsl(var(--muted))"
                fillOpacity={0.3}
                name="AI Prediction"
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="score"
                stackId="2"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
                name="Actual Score"
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">52</div>
              <div className="text-sm text-muted-foreground">Current Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">↓33</div>
              <div className="text-sm text-muted-foreground">30-day Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">87%</div>
              <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Risk Factor Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Factor Analysis</CardTitle>
            <CardDescription>Contributing factors to current risk score</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskFactors}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskFactors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {riskFactors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: factor.color }} />
                    {factor.name}
                  </div>
                  <span className="font-medium">{factor.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Intervention Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle>Intervention Success Rates</CardTitle>
            <CardDescription>Effectiveness of different care interventions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interventionData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.intervention}</span>
                    <span className="font-medium">{item.success}%</span>
                  </div>
                  <Progress value={item.success} className="h-2" />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-success/10 rounded-lg">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm font-medium">Recommended Next Action</p>
                  <p className="text-xs text-muted-foreground">
                    Medication adjustment shows highest success rate for your profile
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Predictive Model Performance</CardTitle>
          <CardDescription>AI accuracy across different prediction timeframes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={modelAccuracy}>
              <RadialBar
                minAngle={15}
                label={{ position: "insideStart", fill: "#fff" }}
                background
                clockWise
                dataKey="accuracy"
                fill="hsl(var(--primary))"
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-4 gap-4 text-center">
            {modelAccuracy.map((item, index) => (
              <div key={index}>
                <div className="text-lg font-bold">{item.accuracy}%</div>
                <div className="text-xs text-muted-foreground">{item.timeframe}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
