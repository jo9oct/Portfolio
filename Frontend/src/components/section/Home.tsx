import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Printer,
} from "lucide-react";

import { TypingText } from "@/components/subSection/TypingText";
import {
  abilities,
  profile,
  skillsList
} from "@/lib/portfolio-data";

export function Home() {
  function goToSkills() {
    const el = document.getElementById("skills");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  
  return (
    <section id="home" className="pt-14 md:pt-32 pb-8">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-mono text-[11px] tracking-wide text-muted-foreground/70 mb-4"
      >
        {"<!-- Hello, world -->"}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="text-2xl md:text-3xl font-medium text-foreground mb-4"
      >
        Yohannis Hailye
      </motion.h2>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1]"
      >
        <span className="text-foreground">I'm </span>
        <TypingText
          words={abilities}
          className="text-muted-foreground"
          typeSpeed={75}
          deleteSpeed={40}
          pause={1400}
        />
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.18 }}
        className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
      >
        {profile.tagline}
      </motion.p>

      <motion.pre
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.24 }}
        className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card/60 px-5 py-4 font-mono text-[13px] md:text-sm leading-relaxed text-muted-foreground"
      >
        <code>
          <span className="text-purple-300">let</span>{" "}
          <span className="text-foreground">skills</span>{" "}
          <span className="text-muted-foreground">=</span>{" "}
          <span className="text-foreground">[</span>
          {skillsList.map((s, i) => (
            <span key={s}>
              <span className="text-emerald-300">{`'${s}'`}</span>
              {i < skillsList.length - 1 ? <span className="text-muted-foreground">, </span> : null}
            </span>
          ))}
          <span className="text-foreground">]</span>
        </code>
      </motion.pre>

      <div className="mt-6 flex justify-center">
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          onClick={goToSkills}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition"
        >
          <Printer className="h-3 w-3" /> Print
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.25 }}
        className="mt-8 flex flex-wrap gap-3"
      >
        <a href="#projects" className="btn-sweep-solid">
          <span>View my work</span>
          <ArrowUpRight className="h-4 w-4" />
        </a>
        <a href={profile.cv} download className="btn-sweep-ghost">
          <span>Download CV</span>
          <ArrowDownToLine className="h-4 w-4" />
        </a>
      </motion.div>
    </section>
  );
}