import { motion, useReducedMotion } from "motion/react";

type MenuOverlayProps = {
  onClose: () => void;
};

const links = [
  { label: "Studio", href: "#studio" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Clients", href: "#clients" },
  { label: "Contact", href: "#contact" },
];

export default function MenuOverlay({ onClose }: MenuOverlayProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-modal="true"
      role="dialog"
      aria-label="Site menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.25 }}
      className="fixed inset-0 z-40 flex flex-col p-[var(--space-page)]"
      style={{
        backgroundColor: "var(--color-inverse-background)",
        color: "var(--color-inverse-foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest">Explore 3KG</p>
        <button type="button" onClick={onClose} aria-label="Close menu">
          close
        </button>
      </div>

      <motion.nav
        aria-label="Mobile navigation"
        className="my-auto flex flex-col"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: reduceMotion ? 0 : 0.08,
            },
          },
        }}
      >
        {links.map((link) => (
          <motion.a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="border-b border-[var(--color-line)] py-3 text-[clamp(2.5rem,14vw,5rem)] leading-none"
            variants={{
              hidden: { opacity: 0, y: reduceMotion ? 0 : 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: reduceMotion ? 0 : 0.4 }}
          >
            {link.label}
          </motion.a>
        ))}
      </motion.nav>

      <a href="#team" onClick={onClose} className="text-sm">
        Meet the team ↗
      </a>
    </motion.div>
  );
}
