"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Patient } from "@/lib/patient-data"
import { Calendar, Clock, User, FileText, Pill, Activity, AlertTriangle, TrendingUp } from "lucide-react"
import { format, parseISO } from "date-fns"

interface PatientTimelineProps {
  patient: Patient
  showAllEvents?: boolean
  maxEvents?: number
}

interface TimelineEvent {
  id: string
  date: string
  time?: string
  type: "appointment" | "note" | "lab" | "medication" | "alert" | "intervention" | "vitals"
  title: string
  description: string
  provider?: string
  status?: string
  severity?: "low" | "medium" | "high" | "critical"
  icon: React.ReactNode
}

export function PatientTimeline({ patient, showAllEvents = false, maxEvents = 10 }: PatientTimelineProps) {
  // Combine all events into a single timeline
  const createTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = []

    // Add appointments
    patient.appointments.forEach(appointment => {
      events.push({
        id: `apt-${appointment.id}`,
        date: appointment.date,
        time: appointment.time,
        type: "appointment",
        title: `${appointment.type} with ${appointment.provider}`,
        description: appointment.notes || `${appointment.type} appointment`,
        provider: appointment.provider,
        status: appointment.status,
        icon: <Calendar className="w-4 h-4 text-blue-500" />
      })
    })

    // Add clinical notes
    patient.clinicalNotes.forEach(note => {
      events.push({
        id: `note-${note.id}`,
        date: note.date,
        type: "note",
        title: note.subject,
        description: note.content.substring(0, 150) + (note.content.length > 150 ? "..." : ""),
        provider: note.provider,
        icon: <FileText className="w-4 h-4 text-green-500" />
      })
    })

    // Add lab results
    patient.labResults.forEach(lab => {
      events.push({
        id: `lab-${lab.id}`,
        date: lab.date,
        type: "lab",
        title: `${lab.test} - ${lab.value}`,
        description: `Normal range: ${lab.normalRange}${lab.notes ? ` | ${lab.notes}` : ""}`,
        provider: lab.orderedBy,
        status: lab.status,
        icon: <Activity className="w-4 h-4 text-purple-500" />
      })
    })

    // Add medications (start dates)
    patient.medications.forEach(medication => {
      events.push({
        id: `med-${medication.id}`,
        date: medication.startDate,
        type: "medication",
        title: `Started ${medication.name}`,
        description: `${medication.dosage} ${medication.frequency} - Prescribed by ${medication.prescribedBy}`,
        provider: medication.prescribedBy,
        icon: <Pill className="w-4 h-4 text-orange-500" />
      })
    })

    // Add alerts
    patient.alerts.forEach(alert => {
      // Convert timestamp to date (assuming it's recent)
      const alertDate = new Date().toISOString().split('T')[0] // Today's date for demo
      events.push({
        id: `alert-${alert.id}`,
        date: alertDate,
        type: "alert",
        title: alert.message,
        description: `${alert.type.replace('_', ' ')} alert`,
        severity: alert.severity,
        icon: <AlertTriangle className="w-4 h-4 text-red-500" />
      })
    })

    // Add interventions
    patient.interventions.forEach(intervention => {
      events.push({
        id: `int-${intervention.id}`,
        date: intervention.date,
        type: "intervention",
        title: intervention.type,
        description: `${intervention.description}${intervention.outcome ? ` | Outcome: ${intervention.outcome}` : ""}`,
        provider: intervention.provider,
        icon: <TrendingUp className="w-4 h-4 text-indigo-500" />
      })
    })

    // Sort by date (most recent first)
    return events.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateB.getTime() - dateA.getTime()
    })
  }

  const timelineEvents = createTimelineEvents()
  const displayedEvents = showAllEvents ? timelineEvents : timelineEvents.slice(0, maxEvents)

  const getStatusBadge = (event: TimelineEvent) => {
    if (event.type === "appointment" && event.status) {
      const variants = {
        scheduled: "default",
        completed: "secondary",
        cancelled: "destructive",
        "no-show": "destructive"
      } as const
      return <Badge variant={variants[event.status as keyof typeof variants] || "default"}>{event.status}</Badge>
    }
    
    if (event.type === "lab" && event.status) {
      const variants = {
        normal: "secondary",
        elevated: "destructive",
        low: "outline",
        critical: "destructive"
      } as const
      return <Badge variant={variants[event.status as keyof typeof variants] || "secondary"}>{event.status}</Badge>
    }

    if (event.type === "alert" && event.severity) {
      const variants = {
        low: "secondary",
        medium: "outline",
        high: "destructive",
        critical: "destructive"
      } as const
      return <Badge variant={variants[event.severity as keyof typeof variants] || "secondary"}>{event.severity}</Badge>
    }

    return null
  }

  const formatEventDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr)
      return format(date, "MMM dd, yyyy")
    } catch {
      // Fallback for dates that aren't ISO format
      return dateStr
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Patient Timeline
        </CardTitle>
        <CardDescription>
          Chronological view of medical history and events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline line */}
              {index < displayedEvents.length - 1 && (
                <div className="absolute left-6 top-12 w-px h-16 bg-border" />
              )}
              
              {/* Event item */}
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                  {event.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium">{event.title}</h4>
                        {getStatusBadge(event)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatEventDate(event.date)}
                        </span>
                        {event.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </span>
                        )}
                        {event.provider && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {event.provider}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {!showAllEvents && timelineEvents.length > maxEvents && (
            <>
              <Separator />
              <div className="text-center">
                <Button variant="outline" size="sm">
                  View All {timelineEvents.length} Events
                </Button>
              </div>
            </>
          )}
          
          {timelineEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No timeline events found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
