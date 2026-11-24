import { motion } from "framer-motion";

import { useMemo, useState } from "react";

import { Section } from "@/components/subSection/Section";
import {
  skillGroups,
} from "@/lib/portfolio-data";

export function Skills() {
  const [active, setActive] = useState<string>("All");
  const allSkillNames = useMemo(
    () => Array.from(new Set(skillGroups.flatMap((g) => g.items.map((i) => i.name)))),
    [],
  );
  const current = skillGroups.find((g) => g.name === active);
  return (
    <Section id="skills" eyebrow="02 — Skills" title="What I work with">
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActive("All")}
          className={active === "All" ? "pill-active" : "pill"}
        >
          All
        </button>
        {skillGroups.map((g) => (
          <button
            key={g.name}
            onClick={() => setActive(g.name)}
            className={active === g.name ? "pill-active" : "pill"}
          >
            {g.name}
          </button>
        ))}
      </div>
      {active === "All" ? (
        <div className="flex flex-wrap gap-2">
          {allSkillNames.map((name) => (
            <span key={name} className="chip">{name}</span>
          ))}
        </div>
      ) : (
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {current!.items.map((s) => (
          <div key={s.name}>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-sm text-foreground">{s.name}</span>
              <span className="text-xs text-muted-foreground">{s.level}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.level}%` }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-foreground rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
      )}
    </Section>
  );
}