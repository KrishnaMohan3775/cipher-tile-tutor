import { motion } from "framer-motion";

const PALETTE = [
  "#f5a623", "#00d4aa", "#e94e77", "#6ab7ff",
  "#b88bff", "#ffd166", "#7ad77a", "#ff8c5a",
  "#5ad1cd", "#d97aff", "#ffe066", "#7fbf7f",
];

export function tileColor(originIndex: number) {
  return PALETTE[originIndex % PALETTE.length];
}

export function Tile({
  char,
  originIndex,
  pos,
  mode,
}: {
  char: string;
  originIndex: number;
  pos: number;
  mode: "enc" | "dec";
}) {
  const color = tileColor(originIndex);
  return (
    <motion.div
      layout
      layoutId={`tile-${originIndex}-${mode}`}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="mono relative flex h-14 w-14 flex-col items-center justify-center rounded-sm border text-base font-semibold"
      style={{
        borderColor: color,
        color,
        background: `color-mix(in oklab, ${color} 12%, transparent)`,
        boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${color} 30%, transparent)`,
      }}
      title={`origin idx ${originIndex} → pos ${pos}`}
    >
      <span className="text-lg leading-none">{char}</span>
      <span className="mt-0.5 text-[10px] opacity-70">{originIndex}</span>
    </motion.div>
  );
}
