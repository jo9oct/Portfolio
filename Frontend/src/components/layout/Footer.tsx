
import { profile } from "@/lib/portfolio-data";
import { VisitorCounter } from "@/components/layout/VisitorCounter";

export function Footer() {
  return (
    <footer className="py-10 border-t border-border text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span className="text-muted-foreground/70">Full-Stack Developer & UI/UX Designer</span>
      </div>
      <div>
        <VisitorCounter />
      </div>
    </footer>
  );
}