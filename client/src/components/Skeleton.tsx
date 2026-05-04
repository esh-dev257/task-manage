const shimmer: React.CSSProperties = { background: '#ede9fe', borderRadius: '8px' };
const card: React.CSSProperties = { background: '#ffffff', border: '1px solid #ede9fe', borderRadius: '16px' };

export function CardSkeleton() {
  return (
    <div className="p-5 animate-pulse space-y-3" style={card}>
      <div className="h-24 rounded-xl" style={shimmer} />
      <div className="h-4 w-3/4 rounded" style={shimmer} />
      <div className="h-3 w-1/2 rounded" style={shimmer} />
    </div>
  );
}

export function TaskSkeleton() {
  return (
    <div className="p-4 animate-pulse space-y-3" style={{ ...card, borderRadius: '12px' }}>
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
    <div className="rounded-2xl p-5 animate-pulse" style={{ background: '#ede9fe' }}>
      <div className="w-9 h-9 rounded-xl mb-3" style={{ background: '#ddd6fe' }} />
      <div className="h-7 w-12 rounded mb-1" style={{ background: '#ddd6fe' }} />
      <div className="h-3 w-20 rounded" style={{ background: '#ddd6fe' }} />
    </div>
  );
}
