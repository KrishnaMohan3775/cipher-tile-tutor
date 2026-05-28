import { Tile } from "./Tile";
import type { Perm } from "@/lib/cipher";

export function RoundsView({
  trace,
  text,
  keys,
  mode,
}: {
  trace: number[][];
  text: string;
  keys: Perm[];
  mode: "enc" | "dec";
}) {
  const accent = mode === "enc" ? "text-amber" : "text-teal";
  return (
    <div className="flex flex-col gap-6">
      {trace.map((row, r) => {
        const label =
          r === 0
            ? "INPUT"
            : r === trace.length - 1
              ? "OUTPUT"
              : `ROUND ${r}`;
        const keyForRow =
          r === 0
            ? null
            : mode === "enc"
              ? keys[r - 1]
              : keys[keys.length - r];
        return (
          <div key={r} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <div className={`mono text-xs tracking-widest ${r === 0 || r === trace.length - 1 ? "text-foreground" : accent}`}>
                {label}
              </div>
              {keyForRow && (
                <div className="mono text-[11px] text-muted-foreground">
                  K = [{keyForRow.map((v, i) => `${i}→${v}`).join(", ")}]
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {row.map((origin, pos) => (
                <Tile
                  key={`${r}-${pos}`}
                  char={text[origin] ?? "·"}
                  originIndex={origin}
                  pos={pos}
                  mode={`${mode}-${r}` as "enc" | "dec"}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
