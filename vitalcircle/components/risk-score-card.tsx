"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface RiskScoreCardProps {
  score: number
  level: "low" | "moderate" | "high"
  trend: "up" | "down" | "stable"
  prediction: string
}

export function RiskScoreCard({ score, level, trend, prediction }: RiskScoreCardProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-success"
      case "moderate":
        return "text-warning"
      case "high":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return CheckCircle
      case "moderate":
        return AlertCircle
      case "high":
        return AlertTriangle
      default:
        return AlertCircle
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return TrendingUp
      case "down":
        return TrendingDown
      default:
        return Minus
    }
  }

  const RiskIcon = getRiskIcon(level)
  const TrendIcon = getTrendIcon(trend)

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <RiskIcon className={`w-5 h-5 mr-2 ${getRiskColor(level)}`} />
            Risk Score
          </span>
          <Badge variant={level === "low" ? "secondary" : level === "moderate" ? "outline" : "destructive"}>
            {level.charAt(0).toUpperCase() + level.slice(1)} Risk
          </Badge>
        </CardTitle>
        <CardDescription>AI-powered health risk assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">{score}/100</span>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendIcon className="w-4 h-4 mr-1" />
              {trend === "stable" ? "Stable" : trend === "up" ? "Improving" : "Declining"}
            </div>
          </div>
          <Progress value={score} className="h-2" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">48-hour prediction:</p>
            <p>{prediction}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
