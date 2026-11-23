import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const slides = [
  {
    type: "video" as const,
    src: "assets/brand/motion/hero-wide.mp4",
    poster: "assets/brand/motion/hero-wide-poster.webp",
    alt: "3KG brand film",
  },
  {
    type: "image" as const,
    src: "assets/profile/srnty-goldenhour.webp",
    alt: "SRNTY Hotels brand identity",
  },
  {
    type: "image" as const,
    src: "assets/profile/zinger_04.webp",
    alt: "Americana recipe film",
  },
];

const headline = ["Strategy first.", "Impact always."];

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);

  const changeSlide = (direction: number) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  const slide = slides[activeSlide];

  return (
    <section
      id="top"
      aria-label="3KG featured work"
      className="relative min-h-svh overflow-hidden"
      style={{
        backgroundColor: "var(--color-inverse-background)",
        color: "var(--color-inverse-foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8 }}
          className="absolute inset-0"
        >
          {slide.type === "video" ? (
            <>
              <video
                className="hidden h-full w-full object-cover md:block"
                src={slide.src}
                poster={slide.poster}
                muted
                loop
                autoPlay
                playsInline
                aria-label={slide.alt}
              />
              <img
                className="h-full w-full object-cover md:hidden"
                src={slide.poster}
                alt={slide.alt}
              />
            </>
          ) : (
            <img className="h-full w-full object-cover" src={slide.src} alt={slide.alt} />
          )}
        </motion.div>
      </AnimatePresence>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--color-inverse-background) 65%, transparent), transparent 65%)",
        }}
      />

      <div className="relative z-10 flex min-h-svh flex-col justify-end gap-8 px-[var(--space-page)] py-[var(--space-page)]">
        <motion.h1
          initial="hidden"
          animate="visible"
          className="text-[clamp(3.5rem,12vw,10rem)] leading-[0.82] tracking-[-0.06em]"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.12 },
            },
          }}
        >
          {headline.map((line) => (
            <motion.span
              key={line}
              className="block"
              variants={{
                hidden: { opacity: 0, y: reduceMotion ? 0 : 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
            >
              {line}
            </motion.span>
          ))}
        </motion.h1>

        <div className="flex flex-col gap-5 text-sm sm:flex-row sm:items-end sm:justify-between">
          <div className="flex gap-6">
            <a href="#studio">Meet 3KG ↓</a>
            <a href="#work">Explore our work ↗</a>
          </div>

          <div className="flex items-center gap-4" aria-label="Slide controls">
            <button type="button" onClick={() => changeSlide(-1)} aria-label="Previous slide">
              ←
            </button>
            <span aria-live="polite">
              {String(activeSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => changeSlide(1)} aria-label="Next slide">
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
