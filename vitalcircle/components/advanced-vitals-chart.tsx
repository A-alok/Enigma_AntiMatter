"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
} from "recharts"
import { TrendingUp, TrendingDown, AlertTriangle, Download } from "lucide-react"

interface AdvancedVitalsChartProps {
  period: string
  chartType?: "line" | "area" | "bar" | "scatter"
}

export function AdvancedVitalsChart({ period, chartType = "line" }: AdvancedVitalsChartProps) {
  // Enhanced mock data with more comprehensive vitals
  const vitalsData = [
    {
      date: "Dec 1",
      bloodPressureSys: 125,
      bloodPressureDia: 80,
      bloodSugar: 140,
      weight: 168,
      heartRate: 72,
      steps: 8500,
      sleep: 7.2,
      stress: 3,
    },
    {
      date: "Dec 3",
      bloodPressureSys: 130,
      bloodPressureDia: 85,
      bloodSugar: 145,
      weight: 167,
      heartRate: 75,
      steps: 9200,
      sleep: 6.8,
      stress: 4,
    },
    {
      date: "Dec 5",
      bloodPressureSys: 128,
      bloodPressureDia: 82,
      bloodSugar: 142,
      weight: 166,
      heartRate: 73,
      steps: 7800,
      sleep: 7.5,
      stress: 2,
    },
    {
      date: "Dec 7",
      bloodPressureSys: 132,
      bloodPressureDia: 88,
      bloodSugar: 148,
      weight: 165,
      heartRate: 78,
      steps: 10100,
      sleep: 6.5,
      stress: 5,
    },
    {
      date: "Dec 9",
      bloodPressureSys: 128,
      bloodPressureDia: 82,
      bloodSugar: 145,
      weight: 165,
      heartRate: 74,
      steps: 8900,
      sleep: 7.8,
      stress: 2,
    },
    {
      date: "Dec 11",
      bloodPressureSys: 125,
      bloodPressureDia: 80,
      bloodSugar: 140,
      weight: 164,
      heartRate: 71,
      steps: 9500,
      sleep: 8.1,
      stress: 1,
    },
    {
      date: "Dec 13",
      bloodPressureSys: 128,
      bloodPressureDia: 82,
      bloodSugar: 145,
      weight: 165,
      heartRate: 73,
      steps: 8700,
      sleep: 7.3,
      stress: 3,
    },
  ]

  const correlationData = vitalsData.map((d) => ({
    stress: d.stress,
    bloodPressure: d.bloodPressureSys,
    bloodSugar: d.bloodSugar,
    sleep: d.sleep,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
              {entry.name.includes("Pressure") && " mmHg"}
              {entry.name.includes("Sugar") && " mg/dL"}
              {entry.name.includes("Weight") && " lbs"}
              {entry.name.includes("Heart") && " bpm"}
              {entry.name.includes("Steps") && " steps"}
              {entry.name.includes("Sleep") && " hours"}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={vitalsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="bloodPressureSys"
                stackId="1"
                stroke="hsl(var(--destructive))"
                fill="hsl(var(--destructive))"
                fillOpacity={0.3}
                name="Systolic BP"
              />
              <Area
                type="monotone"
                dataKey="bloodSugar"
                stackId="2"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                name="Blood Sugar"
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vitalsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="steps" fill="hsl(var(--chart-1))" name="Daily Steps" />
              <Bar dataKey="sleep" fill="hsl(var(--chart-2))" name="Sleep Hours" />
            </BarChart>
          </ResponsiveContainer>
        )
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stress" name="Stress Level" />
              <YAxis dataKey="bloodPressure" name="Blood Pressure" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Stress vs BP" data={correlationData} fill="hsl(var(--primary))" />
            </ScatterChart>
          </ResponsiveContainer>
        )
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vitalsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="bloodPressureSys"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                name="Systolic BP"
                dot={{ fill: "hsl(var(--destructive))" }}
              />
              <Line
                type="monotone"
                dataKey="bloodPressureDia"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="Diastolic BP"
                dot={{ fill: "hsl(var(--chart-2))" }}
              />
              <Line
                type="monotone"
                dataKey="bloodSugar"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Blood Sugar"
                dot={{ fill: "hsl(var(--primary))" }}
              />
              <Line
                type="monotone"
                dataKey="heartRate"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                name="Heart Rate"
                dot={{ fill: "hsl(var(--chart-3))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Comprehensive Vitals Analysis</CardTitle>
            <CardDescription>
              {period === "7d" ? "Past 7 days" : period === "30d" ? "Past 30 days" : "Past 90 days"} •
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)} view
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}

        {/* Insights Panel */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2 p-3 bg-success/10 rounded-lg">
            <TrendingDown className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm font-medium">Weight Trending Down</p>
              <p className="text-xs text-muted-foreground">3 lbs lost this period</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-warning/10 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <div>
              <p className="text-sm font-medium">BP Variability</p>
              <p className="text-xs text-muted-foreground">Higher than normal range</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-primary/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Activity Improving</p>
              <p className="text-xs text-muted-foreground">Step count increasing</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
