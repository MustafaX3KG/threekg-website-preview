import { motion, useReducedMotion } from "motion/react";

export default function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <footer
      id="contact"
      className="px-[var(--space-page)] py-[var(--space-section)]"
      style={{
        backgroundColor: "var(--color-inverse-background)",
        color: "var(--color-inverse-foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <p className="mb-8 font-mono text-xs uppercase tracking-widest">(get in touch)</p>

      <motion.a
        href="https://threekg.com"
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: reduceMotion ? 0 : 0.65, ease: "easeOut" }}
        className="mb-[var(--space-section)] block max-w-[11ch] text-[clamp(3.5rem,11vw,10rem)] leading-[0.85] tracking-[-0.06em]"
      >
        Start a conversation ↗
      </motion.a>

      <div className="grid gap-10 border-t border-[var(--color-line)] pt-8 font-mono text-sm sm:grid-cols-3">
        <div className="flex flex-col gap-3">
          <span className="text-[var(--color-muted)]">studio</span>
          <span>3KG</span>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[var(--color-muted)]">web</span>
          <a href="https://threekg.com">threekg.com ↗</a>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[var(--color-muted)]">explore</span>
          <a href="#work">Work ↗</a>
          <a href="#services">What we do ↗</a>
          <a href="#top">Back to top ↑</a>
          <span>© 2026 3KG</span>
        </div>
      </div>
    </footer>
  );
}
