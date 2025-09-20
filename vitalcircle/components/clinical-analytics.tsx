"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts"
import { Users, AlertTriangle, CheckCircle, Clock, Download } from "lucide-react"

export function ClinicalAnalytics() {
  // Patient population analytics
  const populationData = [
    { condition: "Type 2 Diabetes", patients: 89, highRisk: 23, avgScore: 68 },
    { condition: "Hypertension", patients: 76, highRisk: 18, avgScore: 72 },
    { condition: "Heart Disease", patients: 45, highRisk: 12, avgScore: 65 },
    { condition: "COPD", patients: 32, highRisk: 8, avgScore: 71 },
    { condition: "Arthritis", patients: 28, highRisk: 5, avgScore: 78 },
  ]

  // Intervention outcomes over time
  const outcomeData = [
    { month: "Aug", successful: 85, total: 120, avgImprovement: 15 },
    { month: "Sep", successful: 92, total: 135, avgImprovement: 18 },
    { month: "Oct", successful: 88, total: 142, avgImprovement: 16 },
    { month: "Nov", successful: 95, total: 156, avgImprovement: 22 },
    { month: "Dec", successful: 103, total: 168, avgImprovement: 25 },
  ]

  // Risk distribution
  const riskDistribution = [
    { name: "Low Risk", value: 135, color: "hsl(var(--success))" },
    { name: "Moderate Risk", value: 89, color: "hsl(var(--warning))" },
    { name: "High Risk", value: 23, color: "hsl(var(--destructive))" },
  ]

  // Alert response times
  const alertResponseData = [
    { severity: "Critical", avgResponse: 0.5, target: 1, count: 12 },
    { severity: "High", avgResponse: 2.3, target: 4, count: 34 },
    { severity: "Medium", avgResponse: 8.7, target: 12, count: 67 },
    { severity: "Low", avgResponse: 18.2, target: 24, count: 89 },
  ]

  // Patient engagement metrics
  const engagementData = [
    { week: "Week 1", logins: 180, vitalsLogged: 156, medicationAdherence: 87 },
    { week: "Week 2", logins: 195, vitalsLogged: 172, medicationAdherence: 89 },
    { week: "Week 3", logins: 203, vitalsLogged: 185, medicationAdherence: 91 },
    { week: "Week 4", logins: 187, vitalsLogged: 168, medicationAdherence: 88 },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+12</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intervention Success</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1h</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">-0.3h</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Patients</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">-8</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Population Analytics */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Patient Population by Condition</CardTitle>
                <CardDescription>Risk distribution across chronic conditions</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={populationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="condition" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="patients" fill="hsl(var(--primary))" name="Total Patients" />
                <Bar yAxisId="left" dataKey="highRisk" fill="hsl(var(--destructive))" name="High Risk" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgScore"
                  stroke="hsl(var(--success))"
                  strokeWidth={3}
                  name="Avg Risk Score"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Risk Distribution</CardTitle>
            <CardDescription>Current patient risk levels across your practice</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Intervention Outcomes */}
      <Card>
        <CardHeader>
          <CardTitle>Intervention Outcomes Trend</CardTitle>
          <CardDescription>Success rates and improvement metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={outcomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="successful" fill="hsl(var(--success))" name="Successful Interventions" />
              <Bar yAxisId="left" dataKey="total" fill="hsl(var(--muted))" name="Total Interventions" opacity={0.3} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgImprovement"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                name="Avg Improvement %"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alert Response Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Response Performance</CardTitle>
            <CardDescription>Average response times by alert severity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={alertResponseData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="severity" type="category" />
                <Tooltip />
                <Bar dataKey="avgResponse" fill="hsl(var(--primary))" name="Avg Response (hours)" />
                <Bar dataKey="target" fill="hsl(var(--muted))" name="Target (hours)" opacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Engagement Metrics</CardTitle>
            <CardDescription>Platform usage and adherence trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="logins"
                  stackId="1"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                  name="Platform Logins"
                />
                <Area
                  type="monotone"
                  dataKey="vitalsLogged"
                  stackId="2"
                  stroke="hsl(var(--success))"
                  fill="hsl(var(--success))"
                  fillOpacity={0.6}
                  name="Vitals Logged"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
