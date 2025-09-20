"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

interface RecommendationCardProps {
  recommendation: {
    type: string
    priority: "low" | "medium" | "high"
    title: string
    description: string
    action: string
    icon: LucideIcon
  }
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { type, priority, title, description, action, icon: Icon } = recommendation

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "outline"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{title}</h4>
              <Badge variant={getPriorityColor(priority)} className="text-xs">
                {priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
            <Button size="sm" variant="outline" className="mt-2 bg-transparent">
              {action}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
