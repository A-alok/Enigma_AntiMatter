import { Skeleton } from "@/components/ui/skeleton"

export default function PredictionsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>

          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  )
}
