const shimmer: React.CSSProperties = { background: '#F1F5F9', borderRadius: '6px' };
const card: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #E2E8F0',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

export function CardSkeleton() {
  return (
    <div className="p-5 animate-pulse space-y-3" style={card}>
      <div className="h-20 rounded-lg" style={shimmer} />
      <div className="h-4 w-3/4 rounded" style={shimmer} />
      <div className="h-3 w-1/2 rounded" style={shimmer} />
    </div>
  );
}

export function TaskSkeleton() {
  return (
    <div className="p-4 animate-pulse space-y-3" style={{ ...card, borderRadius: '10px' }}>
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
    <div className="rounded-xl p-5 animate-pulse" style={{ background: '#ffffff', border: '1px solid #E2E8F0' }}>
      <div className="w-8 h-8 rounded-lg mb-3" style={{ background: '#F1F5F9' }} />
      <div className="h-7 w-12 rounded mb-1.5" style={{ background: '#F1F5F9' }} />
      <div className="h-3 w-20 rounded" style={{ background: '#F1F5F9' }} />
    </div>
  );
}
