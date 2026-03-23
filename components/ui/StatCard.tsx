import { ElementType } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ElementType;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  colorClassName?: string;
  delay?: number;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, colorClassName = "text-primary bg-primary/10", delay = 0 }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:border-border-hover transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClassName}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${trend.isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-sora font-bold text-white tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-muted mt-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted/70 mt-3 border-t border-border pt-3">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
