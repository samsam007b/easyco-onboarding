import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Shield } from 'lucide-react';

function SkeletonCard() {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
            <div className="h-8 w-16 bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="h-12 w-12 bg-slate-700 superellipse-xl animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30"
        >
          <div className="h-8 w-8 bg-slate-600 rounded-lg animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-slate-600 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SecurityDashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-emerald-400" />
            Security Center
          </h1>
          <p className="text-slate-400 mt-1">
            Loading data...
          </p>
        </div>
        <div className="h-9 w-28 bg-slate-700 rounded-md animate-pulse" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Score Card Skeleton */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="h-5 w-36 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-48 bg-slate-700/50 rounded animate-pulse mt-1" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-4">
              <div className="w-32 h-32 rounded-full bg-slate-700 animate-pulse" />
              <div className="h-4 w-40 bg-slate-700 rounded animate-pulse mt-4" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-700">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-700/50 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts Skeleton */}
        <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
          <CardHeader>
            <div className="h-5 w-32 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-40 bg-slate-700/50 rounded animate-pulse mt-1" />
          </CardHeader>
          <CardContent>
            <SkeletonList count={3} />
          </CardContent>
        </Card>
      </div>

      {/* Errors and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="h-5 w-36 bg-slate-700 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <SkeletonList count={5} />
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="h-5 w-44 bg-slate-700 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <SkeletonList count={5} />
          </CardContent>
        </Card>
      </div>

      {/* System Status Skeleton */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="h-5 w-32 bg-slate-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-700/30 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
