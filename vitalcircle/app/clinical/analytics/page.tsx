"use client"

import { ClinicalNavigation } from "@/components/clinical-navigation"
import { ClinicalAnalytics } from "@/components/clinical-analytics"
import { Button } from "@/components/ui/button"
import { Calendar, Download, Filter } from "lucide-react"

export default function ClinicalAnalyticsPage() {
  const providerData = {
    name: "Dr. Emily Chen",
    specialty: "Endocrinology",
    license: "MD-12345",
    hospital: "City Medical Center",
  }

  return (
    <div className="min-h-screen bg-background">
      <ClinicalNavigation provider={providerData} />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Clinical Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into patient outcomes and practice performance
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <ClinicalAnalytics />
      </main>
    </div>
  )
}
