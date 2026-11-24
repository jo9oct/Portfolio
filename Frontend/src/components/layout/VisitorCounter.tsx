import { useVisitorCounter } from "@/hooks/useVisitorCounter";
import { Users } from "lucide-react";

export function VisitorCounter() {
  const { totalVisitors, isLoading, error } = useVisitorCounter();

  // If there is an error and no count available, render gracefully without breaking the layout
  if (error && totalVisitors === null) {
    return null;
  }

  return (
    <div
      className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-xl border border-border bg-card/40 backdrop-blur-sm text-xs transition hover:border-white/20"
      title="Verified unique browser visitors"
    >
      <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-zinc-800/80 text-muted-foreground border border-white/5">
        <Users className="w-3.5 h-3.5 text-zinc-300" />
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground/80 leading-none mb-0.5">
          Portfolio Visitors
        </span>
        <div className="flex items-center gap-1.5 leading-none">
          {isLoading && totalVisitors === null ? (
            <span className="inline-block w-12 h-3.5 rounded bg-zinc-800 animate-pulse my-0.5" />
          ) : (
            <span className="font-mono font-medium text-foreground text-xs">
              {typeof totalVisitors === "number"
                ? `${totalVisitors.toLocaleString()} Total Visitors`
                : "— Total Visitors"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisitorCounter;
