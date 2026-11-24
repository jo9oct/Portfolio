import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  id: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, title, children, className = "" }: Props) {
  return (
    <section id={id} className={`py-12 md:py-16 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-10">
            {title}
          </h2>
        ) : null}
        {children}
      </motion.div>
    </section>
  );
}