import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const SESSION_KEY = "3kg-loader-shown";

export default function Loader() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(
    () => sessionStorage.getItem(SESSION_KEY) !== "true",
  );
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!mounted) return;

    sessionStorage.setItem(SESSION_KEY, "true");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <motion.div
      aria-label="Loading 3KG website"
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.45 }}
      onAnimationComplete={() => {
        if (!visible) setMounted(false);
      }}
      onClick={() => setVisible(false)}
      className="fixed inset-0 z-50 grid cursor-pointer place-items-center overflow-hidden"
      style={{
        backgroundColor: "var(--color-inverse-background)",
        color: "var(--color-inverse-foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <video
        className="h-full w-full object-cover"
        src="assets/brand/motion/loader.mp4"
        muted
        autoPlay
        playsInline
        onEnded={() => setVisible(false)}
      />
      <span className="absolute bottom-[var(--space-page)] text-xs uppercase tracking-widest">
        click to skip
      </span>
    </motion.div>
  );
}
