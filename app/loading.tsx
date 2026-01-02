import LoadingHouse from '@/components/ui/LoadingHouse';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <LoadingHouse size={100} strokeWidth={4} />
        <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
