import { TYPE_CLASSES } from "../constants";

// Every badge is as wide as the widest type name ("fighting") at its size,
// so a row or column of types lines up. 74px still fits two side by side
// in the narrowest grid card.
const SIZE_CLASSES = {
  md: "w-[74px] py-1 text-xs",
  sm: "w-[62px] py-0.5 text-[10px]",
};

const TypeBadge = ({ type, size = "md" }) => (
  <span
    className={`inline-block rounded-md text-center font-bold uppercase tracking-wide ${SIZE_CLASSES[size]} ${TYPE_CLASSES[type]}`}
  >
    {type}
  </span>
);

export default TypeBadge;
