const shimmer = { background: 'rgba(139,92,246,0.1)', borderRadius: '8px' };

export function CardSkeleton() {
  return (
    <div className="rounded-2xl p-5 animate-pulse space-y-3" style={{ background: 'rgba(30,10,60,0.6)', border: '1px solid rgba(139,92,246,0.15)' }}>
      <div className="h-24 rounded-xl" style={shimmer} />
      <div className="h-4 w-3/4 rounded" style={shimmer} />
      <div className="h-3 w-1/2 rounded" style={shimmer} />
    </div>
  );
}

export function TaskSkeleton() {
  return (
    <div className="rounded-xl p-4 animate-pulse space-y-3" style={{ background: 'rgba(30,10,60,0.6)', border: '1px solid rgba(139,92,246,0.15)' }}>
      <div className="flex justify-between gap-2">
        <div className="h-4 w-2/3 rounded" style={shimmer} />
        <div className="h-4 w-14 rounded-full" style={shimmer} />
      </div>
      <div className="h-3 w-full rounded" style={shimmer} />
      <div className="flex justify-between">
        <div className="h-3 w-24 rounded" style={shimmer} />
        <div className="h-3 w-20 rounded" style={shimmer} />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="rounded-2xl p-5 animate-pulse" style={{ background: 'rgba(30,10,60,0.6)', border: '1px solid rgba(139,92,246,0.15)' }}>
      <div className="w-10 h-10 rounded-xl mb-3" style={shimmer} />
      <div className="h-7 w-12 rounded mb-1" style={shimmer} />
      <div className="h-3 w-20 rounded" style={shimmer} />
    </div>
  );
}
