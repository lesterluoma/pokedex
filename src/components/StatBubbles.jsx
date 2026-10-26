import { STATS } from "../constants";

/**
 * Row of colored stat bubbles (HP, ATK, ... plus the total).
 * `stats` is the [{ name, value }] list from getPokemonDetails().
 */
const StatBubbles = ({ stats, className = "justify-center" }) => {
  const total = stats.reduce((sum, stat) => sum + stat.value, 0);
  const statBubbles = [
    ...stats.map(({ name, value }) => ({ ...STATS[name], value })),
    { label: "TOT", className: "bg-stats-total", value: total },
  ];

  return (
    <div className={`flex gap-1.5 ${className}`}>
      {statBubbles.map(({ label, className, value }) => (
        <div
          key={label}
          className="flex w-10 flex-col items-center rounded-full bg-page p-1 pb-2"
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-[9px] font-bold text-white ${className}`}
          >
            {label}
          </span>
          <span className="mt-1 text-xs font-semibold">{value}</span>
        </div>
      ))}
    </div>
  );
};

export default StatBubbles;
