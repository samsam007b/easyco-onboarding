import LoadingHouse from '@/components/ui/LoadingHouse';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 relative">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Section Skeleton */}
        <div className="bg-white superellipse-3xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-2" />
              <div className="h-4 w-48 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 p-4 superellipse-xl">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Filters Skeleton */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>

        {/* Properties List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white superellipse-2xl shadow-lg p-6">
              <div className="flex gap-6">
                <div className="flex-1">
                  <div className="h-6 w-3/4 bg-gray-200 rounded-lg animate-pulse mb-3" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded-lg animate-pulse mb-4" />
                  <div className="flex gap-4 mb-4">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex flex-col gap-2 w-48">
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Centered Loading House */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <LoadingHouse size={80} />
      </div>
    </div>
  )
}
