interface StatCardProps {
  label: string;
  value: number;
  bg: string;
  textColor: string;
  icon: React.ReactNode;
  sub?: string;
}

export default function StatCard({ label, value, bg, textColor, icon, sub }: StatCardProps) {
  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-3 ${bg} relative overflow-hidden`}>
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center ${textColor}`}>
          {icon}
        </div>
        {sub && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 ${textColor}`}>
            {sub}
          </span>
        )}
      </div>
      <div>
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        <p className={`text-sm font-medium mt-0.5 ${textColor} opacity-80`}>{label}</p>
      </div>
      {/* decorative circle */}
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-white/5" />
    </div>
  );
}
