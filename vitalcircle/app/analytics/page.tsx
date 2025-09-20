"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PatientNavigation } from "@/components/patient-navigation"
import { AdvancedVitalsChart } from "@/components/advanced-vitals-chart"
import { RiskAnalyticsDashboard } from "@/components/risk-analytics-dashboard"
import { BarChart3, LineChart, PieChart, Activity, Download } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [chartType, setChartType] = useState<"line" | "area" | "bar" | "scatter">("line")

  return (
    <div className="min-h-screen bg-background">
      <PatientNavigation />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Health Analytics</h1>
            <p className="text-muted-foreground">Comprehensive insights into your health trends and risk factors</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="vitals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vitals">Vitals & Trends</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="space-y-6">
            {/* Chart Type Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Visualization Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Button
                    variant={chartType === "line" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType("line")}
                  >
                    <LineChart className="w-4 h-4 mr-2" />
                    Line Chart
                  </Button>
                  <Button
                    variant={chartType === "area" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType("area")}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Area Chart
                  </Button>
                  <Button
                    variant={chartType === "bar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType("bar")}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Bar Chart
                  </Button>
                  <Button
                    variant={chartType === "scatter" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType("scatter")}
                  >
                    <PieChart className="w-4 h-4 mr-2" />
                    Scatter Plot
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Vitals Chart */}
            <AdvancedVitalsChart period={timeRange} chartType={chartType} />

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Score</CardTitle>
                  <CardDescription>Overall health trend</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success mb-2">78/100</div>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-success">+5 points</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Goal Achievement</CardTitle>
                  <CardDescription>Monthly targets met</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">7/10</div>
                  <p className="text-sm text-muted-foreground">Weight loss and BP goals achieved</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consistency Score</CardTitle>
                  <CardDescription>Data logging frequency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-warning mb-2">85%</div>
                  <p className="text-sm text-muted-foreground">Good adherence to monitoring routine</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <RiskAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI-Generated Insights</CardTitle>
                  <CardDescription>Personalized recommendations based on your data patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">Blood Pressure Pattern Detected</h4>
                      <p className="text-sm text-muted-foreground">
                        Your blood pressure tends to be higher on weekdays, particularly Tuesday and Wednesday. This
                        correlates with your reported stress levels. Consider stress management techniques during
                        mid-week periods.
                      </p>
                    </div>

                    <div className="p-4 bg-success/10 rounded-lg">
                      <h4 className="font-semibold text-success mb-2">Positive Trend Identified</h4>
                      <p className="text-sm text-muted-foreground">
                        Your weight loss progress is accelerating. The combination of increased step count and
                        consistent meal timing appears to be very effective for your metabolism.
                      </p>
                    </div>

                    <div className="p-4 bg-warning/10 rounded-lg">
                      <h4 className="font-semibold text-warning mb-2">Sleep Quality Impact</h4>
                      <p className="text-sm text-muted-foreground">
                        Poor sleep quality (less than 7 hours) correlates with higher blood sugar readings the following
                        day. Prioritizing sleep hygiene could improve your glucose control.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Predictive Recommendations</CardTitle>
                  <CardDescription>Proactive suggestions to maintain your health trajectory</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-destructive mt-2"></div>
                      <div>
                        <p className="font-medium text-sm">High Priority</p>
                        <p className="text-sm text-muted-foreground">
                          Schedule medication review - adherence patterns suggest timing adjustment needed
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
                      <div>
                        <p className="font-medium text-sm">Medium Priority</p>
                        <p className="text-sm text-muted-foreground">
                          Consider adding evening walks - data shows improved morning glucose after evening activity
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                      <div>
                        <p className="font-medium text-sm">Maintenance</p>
                        <p className="text-sm text-muted-foreground">
                          Continue current meal timing - showing excellent results for glucose stability
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
