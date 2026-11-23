import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import MenuOverlay from "./MenuOverlay";

const links = [
  { label: "Studio", href: "#studio" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Clients", href: "#clients" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const reduceMotion = useReducedMotion();
  const previousScroll = useRef(0);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 80);
      setHidden(currentScroll > previousScroll.current && currentScroll > 80);
      previousScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
        transition={{ duration: reduceMotion ? 0 : 0.3 }}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[var(--space-page)] py-4"
        style={{
          backgroundColor: scrolled
            ? "color-mix(in srgb, var(--color-background) 85%, transparent)"
            : "transparent",
          color: "var(--color-foreground)",
          fontFamily: "var(--font-sans)",
          backdropFilter: scrolled ? "blur(16px)" : "none",
        }}
      >
        <a href="#top" aria-label="3KG home">
          <img
            src="assets/brand/3kg-mark.png"
            alt="3KG"
            className="h-8 w-auto"
          />
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm">
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(true)}
          className="text-sm md:hidden"
        >
          menu
        </button>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <div id="mobile-menu">
            <MenuOverlay onClose={() => setMenuOpen(false)} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
