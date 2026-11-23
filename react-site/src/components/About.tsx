import { motion, useReducedMotion } from "motion/react";

const headingWords = ["Hello,", "we", "are", "Three", "Kilograms."];

const paragraphs = [
  "Great brands aren’t manufactured. They’re born, nurtured, and grown.",
  "At 3KG, we treat every brand like a living idea; one that deserves attention, care, and bold thinking to reach its full potential.",
  "We build brands through a combination of strategic thinking, creative campaigns, and integrated execution.",
];

export default function About() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="studio"
      className="grid gap-12 px-[var(--space-page)] py-[var(--space-section)] md:grid-cols-2"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div>
        <p className="mb-8 font-mono text-xs uppercase tracking-widest">About us</p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.08 },
            },
          }}
          className="flex max-w-[10ch] flex-wrap gap-x-[0.22em] text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.05em]"
        >
          {headingWords.map((word, index) => (
            <motion.span
              key={word}
              className="inline-block overflow-hidden"
              variants={{
                hidden: { opacity: 0, y: reduceMotion ? 0 : "100%" },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }}
            >
              {index === headingWords.length - 1 ? <em>{word}</em> : word}
            </motion.span>
          ))}
        </motion.h2>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: reduceMotion ? 0 : 0.1 },
          },
        }}
        className="flex max-w-2xl flex-col justify-end gap-8 text-lg leading-relaxed"
      >
        {paragraphs.map((paragraph) => (
          <motion.p
            key={paragraph}
            variants={{
              hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
          >
            {paragraph}
          </motion.p>
        ))}
        <motion.a
          href="#team"
          variants={{
            hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
          className="w-fit border-b border-[var(--color-foreground)] pb-1"
        >
          Meet the people behind 3KG ↗
        </motion.a>
      </motion.div>
    </section>
  );
}
