import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { categoryLabels, workProjects, type WorkCategory, type WorkProject } from "../data/work";
import ProjectModal from "./ProjectModal";

type Filter = "all" | WorkCategory;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All work" },
  ...Object.entries(categoryLabels).map(([id, label]) => ({ id: id as WorkCategory, label })),
];

export default function Work() {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(null);

  const filteredProjects = useMemo(
    () => filter === "all" ? workProjects : workProjects.filter((project) => project.category === filter),
    [filter],
  );
  const visibleProjects = showAll || filter !== "all" ? filteredProjects : filteredProjects.slice(0, 6);

  return (
    <section
      id="work"
      className="px-[var(--space-page)] py-[var(--space-section)]"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <h2 className="mb-12 max-w-[8ch] text-[clamp(4rem,12vw,11rem)] leading-[0.82] tracking-[-0.06em]">Selected work.</h2>

      <div className="mb-10 flex gap-6 overflow-x-auto border-y border-[var(--color-line)] py-4" role="group" aria-label="Filter projects">
        {filters.map((item) => {
          const count = item.id === "all" ? workProjects.length : workProjects.filter((project) => project.category === item.id).length;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => {
                setFilter(item.id);
                setShowAll(item.id !== "all");
              }}
              className="shrink-0 pb-1 text-sm"
              style={{ borderBottom: filter === item.id ? "1px solid var(--color-foreground)" : "1px solid transparent" }}
            >
              {item.label} <sup>{count}</sup>
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid gap-[var(--space-page)] md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project) => (
            <motion.article
              layout
              key={project.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              whileHover={reduceMotion ? undefined : "hover"}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: reduceMotion ? 0 : 0.45 }}
              className="group relative min-h-[34rem] cursor-pointer overflow-hidden"
              onClick={() => setSelectedProject(project)}
            >
              <motion.img
                variants={{ hover: { scale: 1.03 } }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                src={project.image.src}
                alt={project.image.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--color-inverse-background) 78%, transparent), transparent 70%)" }} />
              <div className="absolute inset-0 flex flex-col justify-between p-[var(--space-page)]" style={{ color: "var(--color-inverse-foreground)" }}>
                {project.logo ? <img src={project.logo} alt={`${project.title} logo`} className="h-12 w-32 object-contain object-left" /> : <span />}
                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-widest">{categoryLabels[project.category]}</p>
                  <h3 className="text-4xl tracking-[-0.04em]">{project.title}</h3>
                  <motion.div variants={{ hover: { opacity: 1, y: 0 } }} initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </motion.div>
                  <p className="mt-6 text-sm">View project ↗</p>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-[var(--color-line)] pt-6 sm:flex-row sm:items-center">
        <p className="font-mono text-sm">{String(visibleProjects.length).padStart(2, "0")} / {String(workProjects.length).padStart(2, "0")} projects</p>
        {filter === "all" && !showAll && (
          <button type="button" onClick={() => setShowAll(true)} className="border-b border-[var(--color-foreground)] pb-1">
            view all 23 projects ↓
          </button>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            projects={filteredProjects}
            onClose={() => setSelectedProject(null)}
            onSelect={setSelectedProject}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
