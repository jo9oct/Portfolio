import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { profile, projects } from "@/lib/portfolio-data";

function AllProjectsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-5xl px-6 md:px-10 py-10 md:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>

        <p className="mt-8 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          00 — all projects
        </p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight text-foreground">
          All Projects
        </h1>
        <p className="mt-5 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          A complete collection of work I've shipped — from full-stack platforms
          to mobile apps and interface explorations. Filter by tag on the home
          page, or explore the full archive below.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: "easeOut" }}
              className="rounded-2xl border border-border bg-card/60 p-5 transition hover:border-white/20"
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
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
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
            </motion.article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="btn-simple-ghost"
          >
            <FaGithub className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>
      </main>
    </div>
  );
}

export default AllProjectsPage;