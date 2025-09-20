import { AIPredictionEngine } from "@/components/ai-prediction-engine"
import { PatientNavigation } from "@/components/patient-navigation"

export default function PredictionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <PatientNavigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Health Predictions</h1>
          <p className="text-lg text-muted-foreground">
            Advanced predictive analytics for proactive chronic care management
          </p>
        </div>
        <AIPredictionEngine />
      </main>
    </div>
  )
}
