import { useEffect, useState } from "react";
import { Home, User, Wrench, FolderGit2, Mail } from "lucide-react";
import { profile } from "@/lib/portfolio-data";

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const MOBILE_NAV = [
  { id: "home", label: "Home", Icon: Home },
  { id: "about", label: "About", Icon: User },
  { id: "skills", label: "Skills", Icon: Wrench },
  { id: "projects", label: "Projects", Icon: FolderGit2 },
  { id: "contact", label: "Contact", Icon: Mail },
];

export function Navbar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    function onScroll() {
      const probe = window.innerHeight * 0.35;
      let current = NAV[0].id;
      for (const { id } of NAV) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - probe <= 0) current = id;
      }
      setActive(current);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
    <header className="hidden md:block fixed top-0 left-0 right-0 lg:right-[380px] xl:right-[420px] z-40">
      <div className="mx-auto w-full max-w-3xl px-6 md:px-10 pt-4">
        <nav className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/70 backdrop-blur-xl px-3 md:px-4 py-2.5">
          <button
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2.5 shrink-0"
          >
            <span className="relative inline-flex">
              <img src={profile.avatar} alt={profile.name} className="h-9 w-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 inline-flex items-center justify-center text-[11px] font-semibold tracking-wide text-white"/>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
            </span>
            <span className="hidden sm:inline text-sm font-semibold text-foreground">
              Yohannis<span className="text-muted-foreground">.</span>
            </span>
          </button>

          <ul className="hidden md:flex items-center gap-1 text-sm">
            {NAV.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => scrollTo(n.id)}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    active === n.id
                      ? "text-foreground border border-white/15 bg-white/[0.04]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => scrollTo("contact")}
            className="shrink-0 rounded-full px-3.5 md:px-4 py-1.5 text-sm font-medium text-background bg-gradient-to-r from-white to-zinc-300 hover:brightness-95 transition"
          >
            Hire Me
          </button>
        </nav>
      </div>
    </header>

    {/* Mobile bottom nav */}
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 rounded-2xl border border-border bg-background/85 backdrop-blur-xl px-2 py-2 flex items-center justify-around">
      {MOBILE_NAV.map((n) => {
        const Icon = n.Icon;
        const isActive = active === n.id;
        return (
          <button
            key={n.id}
            onClick={() => scrollTo(n.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
              isActive ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? "text-violet-400" : ""}`} />
            <span className="text-[10px]">{n.label}</span>
          </button>
        );
      })}
    </nav>
    </>
  );
}