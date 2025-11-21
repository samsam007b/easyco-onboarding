import LoadingHouse from '@/components/ui/LoadingHouse';

export default function ApplicationsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Header Skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-6 animate-pulse">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="flex gap-2 mb-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded w-24"></div>
        ))}
      </div>

      <div className="flex gap-2 mb-6 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded w-28"></div>
        ))}
      </div>

      {/* Applications List Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              {/* Left Side */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded w-4/5"></div>
                  ))}
                </div>

                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mt-1"></div>
                </div>
              </div>

              {/* Right Side - Actions */}
              <div className="flex md:flex-col gap-2">
                <div className="h-8 bg-gray-200 rounded w-32"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Centered Loading House */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <LoadingHouse size={80} />
      </div>
    </div>
  );
}
