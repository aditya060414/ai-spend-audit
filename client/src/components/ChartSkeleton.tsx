export function ChartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10 animate-pulse">
      <div className="lg:col-span-3 h-72 bg-zinc-900/50 rounded-xl border border-zinc-800/50" />
      <div className="lg:col-span-2 h-72 bg-zinc-900/50 rounded-xl border border-zinc-800/50" />
    </div>
  );
}
