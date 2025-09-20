"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Patient, searchPatients, filterPatients } from "@/lib/patient-data"
import { Search, Filter, X, User, Calendar, AlertTriangle, FileText } from "lucide-react"

interface SearchFilters {
  query: string
  riskLevel: string
  condition: string
  status: string
  provider: string
  ageRange: string
  gender: string
  hasAlerts: boolean
}

interface AdvancedPatientSearchProps {
  onPatientsFound: (patients: Patient[]) => void
  onPatientSelect?: (patient: Patient) => void
  showResults?: boolean
  placeholder?: string
}

export function AdvancedPatientSearch({ 
  onPatientsFound, 
  onPatientSelect,
  showResults = true,
  placeholder = "Search by Patient ID, name, or condition..."
}: AdvancedPatientSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    riskLevel: "all",
    condition: "all",
    status: "all",
    provider: "all",
    ageRange: "all",
    gender: "all",
    hasAlerts: false
  })
  const [searchResults, setSearchResults] = useState<Patient[]>([])
  const [isSearched, setIsSearched] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearch = () => {
    const combinedQuery = searchQuery || filters.query
    let results = searchPatients(combinedQuery)
    
    // Apply additional filters
    const filterOptions = {
      riskLevel: filters.riskLevel,
      condition: filters.condition,
      status: filters.status,
      provider: filters.provider
    }
    
    results = filterPatients(results, filterOptions)
    
    // Apply age range filter
    if (filters.ageRange !== "all") {
      results = results.filter(patient => {
        switch (filters.ageRange) {
          case "young": return patient.age < 30
          case "adult": return patient.age >= 30 && patient.age < 60
          case "senior": return patient.age >= 60
          default: return true
        }
      })
    }
    
    // Apply gender filter
    if (filters.gender !== "all") {
      results = results.filter(patient => 
        patient.gender.toLowerCase() === filters.gender.toLowerCase()
      )
    }
    
    // Apply alerts filter
    if (filters.hasAlerts) {
      results = results.filter(patient => 
        patient.alerts.length > 0 && patient.alerts.some(alert => !alert.acknowledged)
      )
    }
    
    setSearchResults(results)
    setIsSearched(true)
    onPatientsFound(results)
  }

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query)
    const results = searchPatients(query)
    setSearchResults(results)
    setIsSearched(true)
    onPatientsFound(results)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilters({
      query: "",
      riskLevel: "all",
      condition: "all",
      status: "all",
      provider: "all",
      ageRange: "all",
      gender: "all",
      hasAlerts: false
    })
    setSearchResults([])
    setIsSearched(false)
    onPatientsFound([])
  }

  const activeFiltersCount = Object.values(filters).filter(
    (value, index) => index === 0 ? value !== "" : value !== "all" && value !== false
  ).length

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "high": return "destructive"
      case "moderate": return "outline"
      case "low": return "secondary"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Patient Search
          </CardTitle>
          <CardDescription>
            Search for patients by ID, name, condition, or use advanced filters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Advanced
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="risk-level">Risk Level</Label>
                  <Select
                    value={filters.riskLevel}
                    onValueChange={(value) => setFilters({ ...filters, riskLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Risk Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="moderate">Moderate Risk</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={filters.condition}
                    onValueChange={(value) => setFilters({ ...filters, condition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      <SelectItem value="Type 2 Diabetes">Type 2 Diabetes</SelectItem>
                      <SelectItem value="Hypertension">Hypertension</SelectItem>
                      <SelectItem value="Heart Disease">Heart Disease</SelectItem>
                      <SelectItem value="Coronary Artery Disease">Coronary Artery Disease</SelectItem>
                      <SelectItem value="COPD">COPD</SelectItem>
                      <SelectItem value="Hyperlipidemia">Hyperlipidemia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Patient Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters({ ...filters, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider">Assigned Provider</Label>
                  <Select
                    value={filters.provider}
                    onValueChange={(value) => setFilters({ ...filters, provider: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Providers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Providers</SelectItem>
                      <SelectItem value="Dr. Emily Chen">Dr. Emily Chen</SelectItem>
                      <SelectItem value="Dr. Sarah Wilson">Dr. Sarah Wilson</SelectItem>
                      <SelectItem value="Dr. Michael Brown">Dr. Michael Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age-range">Age Range</Label>
                  <Select
                    value={filters.ageRange}
                    onValueChange={(value) => setFilters({ ...filters, ageRange: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Ages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="young">Under 30</SelectItem>
                      <SelectItem value="adult">30-59</SelectItem>
                      <SelectItem value="senior">60+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={filters.gender}
                    onValueChange={(value) => setFilters({ ...filters, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Genders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button onClick={handleSearch} className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Clear All
                </Button>
              </div>
            </div>
          )}

          {/* Quick Search Suggestions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Searches:</Label>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickSearch("VC-2025")}
                className="text-xs"
              >
                Patient ID: VC-2025
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickSearch("diabetes")}
                className="text-xs"
              >
                Diabetes Patients
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickSearch("hypertension")}
                className="text-xs"
              >
                Hypertension
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setFilters({ ...filters, hasAlerts: true })
                  handleSearch()
                }}
                className="text-xs flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" />
                With Alerts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {showResults && isSearched && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Results</span>
              <Badge variant="secondary">{searchResults.length} patients found</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onPatientSelect?.(patient)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{patient.name}</h4>
                          <Badge variant={getRiskBadgeVariant(patient.riskLevel)} className="text-xs">
                            {patient.riskLevel}
                          </Badge>
                          {patient.alerts.some(alert => !alert.acknowledged) && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Alert
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {patient.id} • Age {patient.age} • {patient.primaryCondition}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Last visit: {patient.lastVisit}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {patient.assignedProvider}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        patient.riskLevel === 'high' ? 'text-destructive' : 
                        patient.riskLevel === 'moderate' ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {patient.riskScore}
                      </div>
                      <div className="text-xs text-muted-foreground">Risk Score</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No patients found</h3>
                <p>Try adjusting your search criteria or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
