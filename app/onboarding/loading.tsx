import LoadingHouse from '@/components/ui/LoadingHouse';

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Card Skeleton */}
        <div className="bg-white superellipse-2xl shadow-xl p-8 animate-pulse">
          {/* Progress Bar Skeleton */}
          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>

          {/* Title Skeleton */}
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
          </div>

          {/* Form Fields Skeleton */}
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* Buttons Skeleton */}
          <div className="flex gap-4 mt-8">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded flex-1"></div>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center mt-6">
          <LoadingHouse size={80} />
        </div>
      </div>
    </div>
  );
}
