interface StatCardProps {
  label: string;
  value: number;
  gradient: string;
  icon: React.ReactNode;
  sub?: string;
}

export default function StatCard({ label, value, gradient, icon, sub }: StatCardProps) {
  return (
    <div className="rounded-2xl p-4 lg:p-5 relative overflow-hidden" style={{ background: gradient, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
      <div className="flex items-center justify-between mb-2 lg:mb-3">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,0.15)' }}>
          {icon}
        </div>
        {sub && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: 'rgba(255,255,255,0.15)' }}>
            {sub}
          </span>
        )}
      </div>
      <p className="text-2xl lg:text-3xl font-bold text-white">{value}</p>
      <p className="text-xs lg:text-sm text-white/75 mt-0.5 truncate">{label}</p>
      <div className="absolute -bottom-5 -right-5 w-16 lg:w-20 h-16 lg:h-20 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
      <div className="absolute -bottom-8 -right-8 w-24 lg:w-28 h-24 lg:h-28 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
    </div>
  );
}
