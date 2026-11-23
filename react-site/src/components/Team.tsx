const team = Array.from({ length: 7 }, (_, index) => ({
  id: index + 1,
  name: "Name",
  specialty: "Specialty",
}));

export default function Team() {
  return (
    <section
      id="team"
      className="px-[var(--space-page)] py-[var(--space-section)]"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <p className="mb-6 font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
        From the 3KG company profile
      </p>

      <img
        src="assets/team/team-breakfast.webp"
        alt="Seven people gathered around a breakfast table"
        className="aspect-[4/3] w-full object-cover"
      />

      <ol className="grid border-l border-t border-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-4">
        {team.map((person) => (
          <li
            key={person.id}
            className="flex min-h-28 items-end justify-between border-b border-r border-[var(--color-line)] p-5"
          >
            <span>
              <strong className="block font-medium">{person.name}</strong>
              <span className="text-sm text-[var(--color-muted)]">{person.specialty}</span>
            </span>
            <span className="font-mono text-xs text-[var(--color-muted)]">
              {String(person.id).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
