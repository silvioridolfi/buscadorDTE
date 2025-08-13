"use client"

export function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-gray-700 rounded w-3/4"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-700 rounded w-24"></div>
          <div className="h-6 bg-gray-700 rounded w-28"></div>
        </div>
      </div>

      {/* Navigation skeleton */}
      <div className="flex gap-4 border-b border-gray-700 pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-700 rounded w-20"></div>
        ))}
      </div>

      {/* Sections skeleton */}
      {Array.from({ length: 4 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="border-b border-gray-700 pb-4">
          <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, itemIndex) => (
              <div key={itemIndex} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-700 rounded mt-0.5"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
