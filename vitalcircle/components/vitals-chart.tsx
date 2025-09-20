"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface VitalsChartProps {
  period: string
}

export function VitalsChart({ period }: VitalsChartProps) {
  // Mock data - in real app this would be fetched based on period
  const data = [
    { date: "Dec 1", bloodPressureSys: 125, bloodPressureDia: 80, bloodSugar: 140, weight: 168 },
    { date: "Dec 3", bloodPressureSys: 130, bloodPressureDia: 85, bloodSugar: 145, weight: 167 },
    { date: "Dec 5", bloodPressureSys: 128, bloodPressureDia: 82, bloodSugar: 142, weight: 166 },
    { date: "Dec 7", bloodPressureSys: 132, bloodPressureDia: 88, bloodSugar: 148, weight: 165 },
    { date: "Dec 9", bloodPressureSys: 128, bloodPressureDia: 82, bloodSugar: 145, weight: 165 },
    { date: "Dec 11", bloodPressureSys: 125, bloodPressureDia: 80, bloodSugar: 140, weight: 164 },
    { date: "Dec 13", bloodPressureSys: 128, bloodPressureDia: 82, bloodSugar: 145, weight: 165 },
  ]

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Blood Pressure Trends</CardTitle>
          <CardDescription>Systolic and diastolic readings over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="bloodPressureSys"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                name="Systolic"
              />
              <Line
                type="monotone"
                dataKey="bloodPressureDia"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="Diastolic"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blood Sugar & Weight</CardTitle>
          <CardDescription>Glucose levels and weight tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="bloodSugar"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Blood Sugar (mg/dL)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                name="Weight (lbs)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
