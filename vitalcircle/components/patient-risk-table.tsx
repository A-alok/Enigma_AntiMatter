"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, MessageSquare, Calendar, AlertTriangle } from "lucide-react"

interface Patient {
  id: string
  name: string
  age: number
  condition: string
  riskScore: number
  riskLevel: "low" | "moderate" | "high"
  lastVisit: string
  nextAppointment: string
  status: string
  vitals: {
    bloodPressure: string
    bloodSugar: string
    weight: string
  }
}

interface PatientRiskTableProps {
  patients: Patient[]
  onPatientSelect: (patientId: string) => void
}

export function PatientRiskTable({ patients, onPatientSelect }: PatientRiskTableProps) {
  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "high":
        return "destructive"
      case "moderate":
        return "outline"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-destructive"
      case "moderate":
        return "text-warning"
      case "low":
        return "text-success"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Risk Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Next Appointment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {patient.riskLevel === "high" && <AlertTriangle className="w-4 h-4 text-destructive" />}
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {patient.id} • Age {patient.age}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{patient.condition}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${getRiskColor(patient.riskLevel)}`}>{patient.riskScore}</span>
                    <Badge variant={getRiskBadgeVariant(patient.riskLevel)} className="text-xs">
                      {patient.riskLevel}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{patient.lastVisit}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{patient.nextAppointment}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => onPatientSelect(patient.id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
