import { motion, useReducedMotion } from "motion/react";
import { clientSectors } from "../data/clients";

export default function Clients() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="clients"
      className="px-[var(--space-page)] py-[var(--space-section)]"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <h2 className="mb-16 text-[clamp(4rem,12vw,11rem)] leading-[0.82] tracking-[-0.06em]">
        Clients.
      </h2>

      <div className="space-y-[var(--space-section)]">
        {clientSectors.map((group) => (
          <section key={group.sector} aria-labelledby={`sector-${group.sector.replaceAll(" ", "-").toLowerCase()}`}>
            <h3
              id={`sector-${group.sector.replaceAll(" ", "-").toLowerCase()}`}
              className="mb-5 max-w-xl font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]"
            >
              {group.sector}
            </h3>

            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: reduceMotion ? 0 : 0.03 },
                },
              }}
              className="grid grid-cols-2 border-l border-t border-[var(--color-line)] sm:grid-cols-3 lg:grid-cols-4"
            >
              {group.clients.map((client) => (
                <motion.li
                  key={client.name}
                  whileHover="hover"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.35 }}
                  className="grid min-h-36 place-items-center border-b border-r border-[var(--color-line)] p-6 sm:min-h-44"
                >
                  <motion.img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="max-h-16 w-full max-w-40 object-contain"
                    style={{ filter: "grayscale(1)" }}
                    variants={{
                      hover: { filter: "grayscale(0)" },
                    }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                  />
                </motion.li>
              ))}
            </motion.ul>
          </section>
        ))}
      </div>
    </section>
  );
}
