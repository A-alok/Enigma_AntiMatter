"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, CheckCircle, X } from "lucide-react"

interface Alert {
  id: string
  patientId: string
  patientName: string
  type: string
  severity: "low" | "medium" | "high"
  message: string
  timestamp: string
  condition: string
}

interface AlertsPanelProps {
  alerts: Alert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return AlertTriangle
      case "medium":
        return Clock
      default:
        return CheckCircle
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-warning"
      default:
        return "text-success"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Active Alerts</h3>
        <Button variant="outline" size="sm">
          Mark All as Read
        </Button>
      </div>

      {alerts.map((alert) => {
        const SeverityIcon = getSeverityIcon(alert.severity)
        return (
          <Card key={alert.id} className="border-l-4 border-l-destructive">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`mt-1 ${getSeverityColor(alert.severity)}`}>
                    <SeverityIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold">{alert.patientName}</h4>
                      <Badge variant="outline" className="text-xs">
                        {alert.patientId}
                      </Badge>
                      <Badge variant={getSeverityBadge(alert.severity)} className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.condition}</p>
                    <p className="text-sm mb-3">{alert.message}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="default">
                          Review Patient
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact Patient
                        </Button>
                        <Button size="sm" variant="ghost">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
