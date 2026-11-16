import skills from "../data/skillsData";

export default function Skills() {
  return (
    <div>
      {skills.map((group) => (
        <div
          key={group.name}
          className="grid gap-3 border-t border-line py-6 first:border-t-0 first:pt-0 md:grid-cols-[11rem_1fr] md:gap-10"
        >
          <h3 className="text-sm font-medium text-ink">{group.name}</h3>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {group.items.map((item) => (
              <li key={item.name} className="flex items-baseline gap-2 text-sm text-muted">
                <span className="text-ink">{item.name}</span>
                <span className="font-mono text-[11px]">{item.experience}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
