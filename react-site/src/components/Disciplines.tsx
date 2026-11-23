import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const disciplines = [
  {
    name: "Brand",
    category: "brand",
    services: [
      "Brand strategy",
      "Positioning",
      "Brand architecture",
      "Naming",
      "Verbal identity",
      "Visual identity systems",
      "Brand guidelines & rollout",
    ],
  },
  {
    name: "Design",
    category: "design",
    services: [
      "Graphic design",
      "Editorial design",
      "Report design",
      "Publications",
      "Company profiles",
      "Presentation systems",
      "Packaging design",
    ],
  },
  {
    name: "Campaigns",
    category: "campaigns",
    services: [
      "Campaign strategy",
      "Creative concepts",
      "Launch campaigns",
      "Integrated campaigns",
      "Content strategy",
      "Social media",
      "Media planning & buying",
    ],
  },
  {
    name: "Production",
    category: "production",
    services: [
      "Film production",
      "Video production",
      "Photography",
      "Product & catalogue photography",
      "Food styling",
      "Motion graphics",
      "Post-production",
    ],
  },
  {
    name: "Tech",
    category: "tech",
    services: [
      "Website design",
      "UX/UI",
      "Web development",
      "Microsites",
      "Digital catalogues",
      "Digital platforms",
    ],
  },
  {
    name: "Xperience",
    category: "xperience",
    services: [
      "Strategic gifting",
      "BTL & activations",
      "3D design & printing",
      "Object design",
      "Environmental branding",
      "Wayfinding",
      "Interior branding",
    ],
  },
];

export default function Disciplines() {
  const reduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section
      id="services"
      className="px-[var(--space-page)] py-[var(--space-section)]"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <h2 className="mb-16 max-w-[8ch] text-[clamp(3.5rem,10vw,9rem)] leading-[0.85] tracking-[-0.06em]">
        Six connected disciplines.
      </h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: reduceMotion ? 0 : 0.1 },
          },
        }}
        className="border-t border-[var(--color-line)]"
      >
        {disciplines.map((discipline, index) => {
          const isExpanded = expanded === discipline.category;

          return (
            <motion.article
              key={discipline.category}
              variants={{
                hidden: { opacity: 0, y: reduceMotion ? 0 : 36 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }}
              onHoverStart={() => setExpanded(discipline.category)}
              onHoverEnd={() => setExpanded(null)}
              className="border-b border-[var(--color-line)]"
            >
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-5 py-5 md:gap-10 md:py-7">
                <span className="font-mono text-xs text-[var(--color-muted)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <a
                  href="#work"
                  data-category={discipline.category}
                  className="text-[clamp(2.5rem,7vw,6.5rem)] leading-none tracking-[-0.05em]"
                >
                  {discipline.name}
                </a>
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`discipline-${discipline.category}`}
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} ${discipline.name} services`}
                  onClick={() => setExpanded(isExpanded ? null : discipline.category)}
                  className="grid size-10 place-items-center text-2xl"
                >
                  {isExpanded ? "−" : "+"}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    id={`discipline-${discipline.category}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <ul className="grid gap-2 pb-8 pl-10 text-[var(--color-muted)] sm:grid-cols-2 md:pl-20 lg:grid-cols-3">
                      {discipline.services.map((service) => (
                        <li key={service}>{service}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
