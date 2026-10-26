import { TYPE_CLASSES } from "../constants";

const TypeBadge = ({ type, size = "md" }) => {
  const sizeClasses =
    size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`rounded-md font-bold uppercase tracking-wide ${sizeClasses} ${TYPE_CLASSES[type]}`}
    >
      {type}
    </span>
  );
};

export default TypeBadge;
