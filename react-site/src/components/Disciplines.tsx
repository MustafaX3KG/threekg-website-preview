import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";

type Point = [number, number];
type Form = Point[][];

const disciplines = [
  { name: "Brand", category: "brand", services: ["Brand strategy", "Positioning", "Brand architecture", "Naming", "Verbal identity", "Visual identity systems", "Brand guidelines & rollout"] },
  { name: "Design", category: "design", services: ["Graphic design", "Editorial design", "Report design", "Publications", "Company profiles", "Presentation systems", "Packaging design"] },
  { name: "Campaigns", category: "campaigns", services: ["Campaign strategy", "Creative concepts", "Launch campaigns", "Integrated campaigns", "Content strategy", "Social media", "Media planning & buying"] },
  { name: "Production", category: "production", services: ["Film production", "Video production", "Photography", "Product & catalogue photography", "Food styling", "Motion graphics", "Post-production"] },
  { name: "Tech", category: "tech", services: ["Website design", "UX/UI", "Web development", "Microsites", "Digital catalogues", "Digital platforms"] },
  { name: "Xperience", category: "xperience", services: ["Strategic gifting", "BTL & activations", "3D design & printing", "Object design", "Environmental branding", "Wayfinding", "Interior branding"] },
] as const;

const POINT_COUNT = 192;
const STRANDS = 8;
const STRAND_POINTS = 25;
const TAU = Math.PI * 2;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

function rotate([x, y]: Point, degrees: number): Point {
  const angle = degrees * Math.PI / 180;
  return [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)];
}

function radial(vertices: Point[]): Point[] {
  return Array.from({ length: POINT_COUNT }, (_, index) => {
    const angle = -Math.PI / 2 + index * TAU / POINT_COUNT;
    const ray: Point = [Math.cos(angle), Math.sin(angle)];
    let nearest = Number.POSITIVE_INFINITY;

    vertices.forEach((point, vertexIndex) => {
      const next = vertices[(vertexIndex + 1) % vertices.length];
      const segment: Point = [next[0] - point[0], next[1] - point[1]];
      const denominator = ray[0] * segment[1] - ray[1] * segment[0];
      if (Math.abs(denominator) < 0.00000001) return;
      const distance = (point[0] * segment[1] - point[1] * segment[0]) / denominator;
      const position = (point[0] * ray[1] - point[1] * ray[0]) / denominator;
      if (distance > 0 && position >= 0 && position <= 1) nearest = Math.min(nearest, distance);
    });

    return [ray[0] * nearest, ray[1] * nearest];
  });
}

function circle(radius: number): Point[] {
  return Array.from({ length: POINT_COUNT }, (_, index) => {
    const angle = -Math.PI / 2 + index * TAU / POINT_COUNT;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  });
}

function contourStrands(contour: Point[]): Form {
  return Array.from({ length: STRANDS }, (_, strand) =>
    Array.from({ length: STRAND_POINTS }, (_, point) => contour[(strand * 24 + point) % POINT_COUNT]),
  );
}

function armStrands(angles: number[]): Form {
  return angles.map((angle) => {
    const radians = angle * Math.PI / 180;
    return Array.from({ length: STRAND_POINTS }, (_, point) => {
      const radius = 80 * point / (STRAND_POINTS - 1);
      return [Math.cos(radians) * radius, Math.sin(radians) * radius];
    });
  });
}

const square = radial([[-72, -72], [72, -72], [72, 72], [-72, 72]]);
const forms: Record<string, Form> = {
  dot: contourStrands(circle(0.001)),
  brand: contourStrands(circle(76)),
  design: armStrands([-90, -90, 0, 0, 90, 90, 180, 180]),
  campaigns: armStrands([-90, -45, 0, 45, 90, 135, 180, 225]),
  production: contourStrands(radial([[-65, -78], [65, 0], [-65, 78]])),
  tech: contourStrands(square),
  xperience: armStrands([-45, -45, 45, 45, 135, 135, 225, 225]),
};

function pathFromPoints(points: Point[]) {
  return `M${points.map(([x, y]) => `${x.toFixed(3)},${y.toFixed(3)}`).join("L")}`;
}

function morphPaths(from: Form, to: Form, progress: number) {
  return from.map((strand, strandIndex) => {
    const delay = (strandIndex % 4) * 0.012;
    const local = smooth((progress - delay) / (1 - 0.036));
    const orbit = Math.sin(Math.PI * local);
    const rotation = (strandIndex % 2 ? 1 : -1) * 8 * orbit;
    const angle = -Math.PI / 2 + (strandIndex + 0.5) * TAU / STRANDS;
    const offset = 4.5 * orbit;
    const points = strand.map((point, pointIndex) => {
      const destination = to[strandIndex][pointIndex];
      const rotated = rotate(
        [mix(point[0], destination[0], local), mix(point[1], destination[1], local)],
        rotation,
      );
      return [rotated[0] + Math.cos(angle) * offset, rotated[1] + Math.sin(angle) * offset] as Point;
    });
    return pathFromPoints(points);
  });
}

export default function Disciplines() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(reduceMotion ? 1 : 0);
  const [desktop, setDesktop] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const trailingProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 26,
    mass: 0.45,
  });

  useMotionValueEvent(trailingProgress, "change", (value) => {
    if (!reduceMotion) setProgress(value);
  });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion) setProgress(1);
  }, [reduceMotion]);

  const { activeIndex, paths } = useMemo(() => {
    const phase = clamp(progress) * disciplines.length;
    const index = phase >= disciplines.length
      ? disciplines.length - 1
      : Math.min(disciplines.length - 1, Math.floor(phase));
    const local = phase >= disciplines.length ? 1 : phase - index;
    const from = index === 0 ? forms.dot : forms[disciplines[index - 1].category];
    const to = forms[disciplines[index].category];
    return { activeIndex: index, paths: morphPaths(from, to, local) };
  }, [progress]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className={desktop && !reduceMotion ? "relative h-[430svh]" : "relative"}
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div className={desktop && !reduceMotion
        ? "sticky top-0 grid min-h-svh grid-cols-[minmax(14rem,0.8fr)_minmax(0,2fr)] items-center gap-[var(--space-page)] px-[var(--space-page)] py-[var(--space-page)]"
        : "grid gap-10 px-[var(--space-page)] py-[var(--space-section)] md:grid-cols-[minmax(14rem,0.8fr)_minmax(0,2fr)]"
      }>
        <div className="sticky top-16 z-10 self-start bg-[var(--color-background)] py-4 md:static md:self-center md:bg-transparent md:py-0">
          <h2 className="max-w-[10ch] text-[clamp(2.5rem,7vw,4rem)] leading-[0.92] tracking-[-0.05em]">
            Six connected disciplines.
          </h2>
          <svg
            aria-hidden="true"
            viewBox="-120 -120 240 240"
            className="mt-8 aspect-square w-full max-w-72 overflow-visible"
          >
            {paths.map((path, index) => (
              <motion.path
                key={index}
                animate={{ d: path }}
                transition={{ duration: 0 }}
                fill="none"
                stroke="currentColor"
                strokeWidth="19"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>
        </div>

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {disciplines.map((discipline, index) => {
            const amount = reduceMotion || !desktop
              ? 1
              : clamp(progress * disciplines.length - index);
            const titleProgress = smooth(amount / 0.2);

            return (
              <motion.article
                key={discipline.category}
                animate={{ opacity: amount, y: (1 - amount) * 16 }}
                transition={{ duration: reduceMotion ? 0 : 0.12, ease: "easeOut" }}
                aria-hidden={desktop && !reduceMotion && amount < 0.01}
                className="min-h-44"
              >
                <motion.a
                  href="#work"
                  data-category={discipline.category}
                  animate={{ opacity: titleProgress, y: (1 - titleProgress) * 8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.1 }}
                  className="inline-flex items-center gap-3 text-[clamp(1.4rem,2.2vw,2.4rem)] font-medium tracking-[-0.035em]"
                >
                  <svg aria-hidden="true" viewBox="-120 -120 240 240" className="size-6 overflow-visible">
                    {forms[discipline.category].map((strand, strandIndex) => (
                      <path
                        key={strandIndex}
                        d={pathFromPoints(strand)}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="19"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                  </svg>
                  {discipline.name}
                </motion.a>

                <ul className="mt-4 space-y-1 text-sm leading-relaxed text-[var(--color-muted)]">
                  {discipline.services.map((service, serviceIndex) => {
                    const delay = discipline.services.length > 1
                      ? serviceIndex / (discipline.services.length - 1) * 0.68
                      : 0;
                    const lineProgress = reduceMotion || !desktop
                      ? 1
                      : smooth((amount - delay) / 0.32);
                    return (
                      <motion.li
                        key={service}
                        animate={{ opacity: lineProgress, y: (1 - lineProgress) * 8 }}
                        transition={{ duration: reduceMotion ? 0 : 0.08 }}
                      >
                        {service}
                      </motion.li>
                    );
                  })}
                </ul>

                <span className="sr-only">{index === activeIndex ? "Current discipline" : ""}</span>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
