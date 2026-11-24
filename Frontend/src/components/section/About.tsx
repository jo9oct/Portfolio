import { motion } from "framer-motion";

import { Section } from "@/components/subSection/Section";
import {
  aboutFacts,
  education,
  experience,
} from "@/lib/portfolio-data";
import { useVisitorCounter } from "@/hooks/useVisitorCounter";

export function About() {
  const { totalVisitors, isLoading } = useVisitorCounter();

  return (
    <Section id="about" eyebrow="01 — About" title="About me">
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div className="space-y-5 text-muted-foreground leading-relaxed text-[15px] md:text-base">
          <p>
            I'm a full-stack developer and UI/UX designer with 2+ years of experience building simple and intuitive web and 
            mobile products. I enjoy turning complex problems into smooth and user-friendly experiences. 
            I'm also actively developing my cybersecurity skills through INSA training and independent hands-on learning.
          </p>
          <p>
            I've collaborated with startups and small teams to deliver smooth, fast, and 
            thoughtful interfaces. Outside of coding, I enjoy exploring new tools and 
            contributing to open-source.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {aboutFacts.map((f) => {
            const isVisitorCard = f.label.toLowerCase() === "visitors";
            const displayValue = isVisitorCard
              ? typeof totalVisitors === "number"
                ? totalVisitors.toLocaleString()
                : isLoading
                ? "..."
                : "—"
              : f.value;

            return (
              <div key={f.label} className="rounded-2xl border border-border bg-card/60 p-4">
                <div className="text-2xl font-semibold text-foreground">
                  {isVisitorCard && isLoading && totalVisitors === null ? (
                    <span className="inline-block w-12 h-6 rounded bg-zinc-800 animate-pulse" />
                  ) : (
                    displayValue
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{f.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div id="experience" className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Education
          </h3>
          <ol className="relative border-l border-border pl-6 space-y-6">
            {education.map((e, i) => (
              <motion.li
                key={e.school}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                className="relative"
              >
                <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full bg-foreground" />
                <div className="text-xs text-muted-foreground">{e.period}</div>
                <h4 className="text-base font-medium text-foreground mt-1">{e.degree}</h4>
                <div className="text-sm text-muted-foreground mt-0.5">{e.school}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {e.description}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Experience
          </h3>
          <ol className="relative border-l border-border pl-6 space-y-6">
            {experience.map((e, i) => (
              <motion.li
                key={e.role}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                className="relative"
              >
                <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full bg-foreground" />
                <div className="text-xs text-muted-foreground">{e.period}</div>
                <h4 className="text-base font-medium text-foreground mt-1">
                  {e.role} · <span className="text-muted-foreground">{e.company}</span>
                </h4>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {e.description}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}