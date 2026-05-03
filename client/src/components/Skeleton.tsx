export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  );
}

export function TaskSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-100 rounded w-14" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="flex justify-between">
        <div className="h-3 bg-gray-100 rounded w-24" />
        <div className="h-3 bg-gray-100 rounded w-20" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-xl" />
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-12" />
        <div className="h-3 bg-gray-100 rounded w-20" />
      </div>
    </div>
  );
}
