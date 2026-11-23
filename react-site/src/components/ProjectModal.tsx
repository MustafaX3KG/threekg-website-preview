import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { categoryLabels, type WorkProject } from "../data/work";

type ProjectModalProps = {
  project: WorkProject;
  projects: WorkProject[];
  onClose: () => void;
  onSelect: (project: WorkProject) => void;
};

export default function ProjectModal({ project, projects, onClose, onSelect }: ProjectModalProps) {
  const reduceMotion = useReducedMotion();
  const currentIndex = projects.findIndex((item) => item.id === project.id);

  const move = (direction: number) => {
    const nextIndex = (currentIndex + direction + projects.length) % projects.length;
    onSelect(projects[nextIndex]);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.35 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-line)] px-[var(--space-page)] py-4 backdrop-blur-xl" style={{ backgroundColor: "color-mix(in srgb, var(--color-background) 88%, transparent)" }}>
        <button type="button" onClick={() => move(-1)}>← Previous project</button>
        <span className="font-mono text-xs uppercase tracking-widest">{categoryLabels[project.category]}</span>
        <button type="button" onClick={onClose} aria-label="Close project">close ×</button>
      </header>

      <div className="px-[var(--space-page)] py-[var(--space-section)]">
        <p className="mb-5 font-mono text-xs uppercase tracking-widest">{project.title}</p>
        <h2 id="project-modal-title" className="mb-16 text-[clamp(3.5rem,11vw,10rem)] leading-[0.85] tracking-[-0.06em]">
          A closer look.
        </h2>

        <div className="grid gap-[var(--space-page)] md:grid-cols-2">
          {project.gallery.map((image, index) => (
            <motion.img
              key={image.src}
              src={image.src}
              alt={image.alt}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduceMotion ? 0 : 0.5 }}
              className={`w-full object-cover ${index === 0 ? "md:col-span-2" : ""}`}
            />
          ))}
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-[var(--color-line)] px-[var(--space-page)] py-8">
        <button type="button" onClick={() => move(-1)}>← Previous project</button>
        <button type="button" onClick={() => move(1)}>Next project →</button>
      </footer>
    </motion.div>
  );
}
