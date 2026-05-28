import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Nav } from "@/components/cipher/Nav";
import { cayleyTable, compose, cycleNotation, inverse, smallGroup } from "@/lib/cipher";

export const Route = createFileRoute("/group")({
  head: () => ({
    meta: [
      { title: "Group Theory — CipherGuard" },
      { name: "description", content: "Cayley table, cycle notation, and the group axioms over permutations." },
    ],
  }),
  component: GroupPage,
});

function GroupPage() {
  const [n, setN] = useState(3);
  const elements = useMemo(() => smallGroup(n, 120), [n]);
  const table = useMemo(() => cayleyTable(elements), [elements]);
  const [sel, setSel] = useState<{ i: number; j: number } | null>(null);

  const maxIdx = elements.length - 1;

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <div className="mono text-xs tracking-[0.3em] text-muted-foreground">§02 · GROUP THEORY EXPLORER</div>
          <h1 className="mt-2 font-display text-4xl">
            The symmetric group <span className="italic text-amber">Sₙ</span>.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Round keys live inside Sₙ — the group of all bijections on n positions. Composition (∘) is
            associative, every element has an inverse, and the identity permutation is the neutral element.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">n =</label>
          {[2, 3, 4].map((v) => (
            <button
              key={v}
              onClick={() => { setN(v); setSel(null); }}
              className={`mono rounded-sm border px-3 py-1.5 text-xs ${
                n === v ? "border-amber text-amber" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {v}  · |S{v}|={[2, 6, 24][v - 2]}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Cayley */}
          <div className="panel overflow-auto p-4">
            <div className="mono mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              Cayley table · cell (i,j) = i ∘ j
            </div>
            <div
              className="inline-grid gap-[2px]"
              style={{ gridTemplateColumns: `auto repeat(${elements.length}, 1fr)` }}
            >
              <div />
              {elements.map((_, j) => (
                <div key={`h${j}`} className="mono text-center text-[10px] text-muted-foreground">{j}</div>
              ))}
              {table.map((row, i) => (
                <FragmentRow
                  key={i}
                  i={i}
                  row={row}
                  maxIdx={maxIdx}
                  onClick={(j) => setSel({ i, j })}
                  sel={sel}
                />
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <div className="panel p-5">
              <div className="mono mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                Selected composition
              </div>
              {sel ? (
                <div className="mono space-y-2 text-sm">
                  <div><span className="text-amber">P</span> = [{elements[sel.i].join(",")}] = {cycleNotation(elements[sel.i])}</div>
                  <div><span className="text-amber">Q</span> = [{elements[sel.j].join(",")}] = {cycleNotation(elements[sel.j])}</div>
                  <div className="border-t border-border pt-2">
                    <span className="text-teal">P ∘ Q</span> = [{compose(elements[sel.i], elements[sel.j]).join(",")}]
                  </div>
                  <div className="text-muted-foreground">
                    cycle: {cycleNotation(compose(elements[sel.i], elements[sel.j]))}
                  </div>
                </div>
              ) : (
                <div className="mono text-xs text-muted-foreground">Click any cell in the Cayley table.</div>
              )}
            </div>

            <div className="panel p-5">
              <div className="mono mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                Group axioms
              </div>
              <ul className="space-y-2 text-sm">
                <Axiom ok label="Closure" detail="P ∘ Q ∈ Sₙ for all P, Q — verified by table membership." />
                <Axiom ok label="Identity" detail="e = [0,1,…,n−1] satisfies e ∘ P = P ∘ e = P." />
                <Axiom ok label="Inverses" detail={`Every P has P⁻¹ with P ∘ P⁻¹ = e. e.g. [${elements[1].join(",")}]⁻¹ = [${inverse(elements[1]).join(",")}]`} />
                <Axiom ok label="Associativity" detail="(P ∘ Q) ∘ R = P ∘ (Q ∘ R) — inherited from function composition." />
              </ul>
            </div>

            <div className="panel p-5">
              <div className="mono mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                Cycle notation gallery
              </div>
              <div className="mono grid grid-cols-1 gap-1 text-[11px]">
                {elements.slice(0, 12).map((e, i) => (
                  <div key={i} className="flex justify-between border-b border-border/60 py-1">
                    <span className="text-muted-foreground">[{e.join(",")}]</span>
                    <span className="text-amber">{cycleNotation(e)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FragmentRow({
  i, row, maxIdx, onClick, sel,
}: { i: number; row: number[]; maxIdx: number; onClick: (j: number) => void; sel: { i: number; j: number } | null }) {
  return (
    <>
      <div className="mono pr-2 text-right text-[10px] text-muted-foreground">{i}</div>
      {row.map((v, j) => {
        const t = v / maxIdx;
        const isSel = sel?.i === i && sel?.j === j;
        return (
          <button
            key={j}
            onClick={() => onClick(j)}
            className="mono flex h-7 w-7 items-center justify-center rounded-sm text-[10px] transition hover:outline hover:outline-1 hover:outline-amber"
            style={{
              background: `color-mix(in oklab, var(--amber) ${10 + t * 55}%, var(--card))`,
              color: t > 0.55 ? "var(--background)" : "var(--foreground)",
              outline: isSel ? "1px solid var(--teal)" : undefined,
            }}
            title={`row ${i} ∘ col ${j} = ${v}`}
          >
            {v}
          </button>
        );
      })}
    </>
  );
}

function Axiom({ ok, label, detail }: { ok: boolean; label: string; detail: string }) {
  return (
    <li className="flex gap-3">
      <span className={`mono mt-0.5 text-xs ${ok ? "text-teal" : "text-destructive"}`}>{ok ? "✓" : "✗"}</span>
      <div>
        <div className="mono text-xs uppercase tracking-widest">{label}</div>
        <div className="text-xs text-muted-foreground">{detail}</div>
      </div>
    </li>
  );
}
