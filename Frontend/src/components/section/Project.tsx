import { motion } from "framer-motion";
import {
  ArrowUpRight,
} from "lucide-react";
import { FaGithub} from "react-icons/fa";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Section } from "@/components/subSection/Section";
import {
  profile,
  projects,
} from "@/lib/portfolio-data";


export function Projects() {
  const cats = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.category)))], []);
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? projects : projects.filter((p) => p.category === cat);
  const visible = filtered.slice(0, 4);
  return (
    <Section id="projects" eyebrow="03 — Work" title="Selected projects">
      <div className="flex flex-wrap gap-2 mb-6">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cat === c ? "pill-active" : "pill"}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="card-hover-target group rounded-2xl border border-border bg-card/60 p-5 transition hover:border-white/20"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {p.category}
              </span>
              {p.featured ? (
                <span className="text-[11px] text-foreground/80">★ Featured</span>
              ) : null}
            </div>
            <h3 className="text-lg font-medium text-foreground">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {p.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="chip-sm">{t}</span>
              ))}
            </div>
            {p.live && (
              <div className="mt-4 flex items-center gap-4 text-sm">
                <a href={p.live} target="_blank" rel="noreferrer" className="link">
                  Live <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
            {p.github && (
              <div className="code-overlay">
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-sweep-solid"
                >
                  <FaGithub className="h-4 w-4" />
                  <span>View Code</span>
                </a>
              </div>
            )}
          </motion.article>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/projects" className="btn-simple">
          <span>View All Projects</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <a href={profile.github} target="_blank" rel="noreferrer" className="btn-simple-ghost">
          <FaGithub className="h-4 w-4" />
          <span>GitHub</span>
        </a>
      </div>
    </Section>
  );
}
