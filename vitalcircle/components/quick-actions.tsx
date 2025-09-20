"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Calendar, MessageSquare, FileText, Activity, Pill } from "lucide-react"

export function QuickActions() {
  const actions = [
    { icon: Plus, label: "Log Vitals", description: "Record blood pressure, weight, etc." },
    { icon: Pill, label: "Take Medication", description: "Mark medication as taken" },
    { icon: Activity, label: "Log Exercise", description: "Track physical activity" },
    { icon: Calendar, label: "Schedule Visit", description: "Book appointment with provider" },
    { icon: MessageSquare, label: "Message Team", description: "Contact your care team" },
    { icon: FileText, label: "View Reports", description: "Access lab results and reports" },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => (
        <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <action.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
