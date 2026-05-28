import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/cipher/Nav";
import { RoundsView } from "@/components/cipher/RoundsView";
import {
  applyPerm,
  decrypt,
  encrypt,
  factorial,
  padText,
  roundKeys,
  traceIndices,
} from "@/lib/cipher";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cipher Lab — CipherGuard" },
      { name: "description", content: "Visualize encryption and decryption as permutations move characters through rounds." },
    ],
  }),
  component: Lab,
});

function Lab() {
  const [raw, setRaw] = useState("CIPHERGUARD");
  const [n, setN] = useState(11);
  const [k, setK] = useState(4);
  const [mode, setMode] = useState<"enc" | "dec">("enc");
  const [seed, setSeed] = useState(42);

  const text = useMemo(() => padText(raw, n), [raw, n]);
  const keys = useMemo(() => roundKeys(seed, n, k), [seed, n, k]);

  const { final, rounds } = useMemo(
    () => (mode === "enc" ? encrypt(text, keys) : decrypt(text, keys)),
    [text, keys, mode],
  );
  const trace = useMemo(() => traceIndices(n, keys, mode), [n, keys, mode]);

  // Verify reversibility
  const verify = useMemo(() => {
    const enc = encrypt(text, keys).final;
    const dec = decrypt(enc, keys).final;
    return dec === text;
  }, [text, keys]);

  const displaced = useMemo(() => {
    let c = 0;
    for (let i = 0; i < n; i++) if (text[i] !== final[i]) c++;
    return c;
  }, [text, final, n]);

  const avalanche = useMemo(
    () => Array.from({ length: n }, (_, i) => text[i] !== final[i]),
    [text, final, n],
  );

  const copy = () => navigator.clipboard?.writeText(final);

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="mono text-xs tracking-[0.3em] text-muted-foreground">
              §01 · CIPHER LABORATORY
            </div>
            <h1 className="mt-2 font-display text-4xl">
              Encryption as a sequence of <span className="text-amber italic">permutations</span>.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Each character is a position in <code className="mono">{`{0…n-1}`}</code>. A round key Kᵢ is a
              bijection that rearranges those positions. Encryption composes k such bijections;
              decryption applies their inverses in reverse — guaranteeing Dec(Enc(x)) = x.
            </p>
          </div>
          <div
            className={`mono shrink-0 rounded-sm border px-3 py-2 text-xs ${
              verify ? "border-teal text-teal" : "border-destructive text-destructive"
            }`}
          >
            {verify ? "✓ Dec(Enc(x)) = x" : "✗ verification failed"}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* Input panel */}
          <aside className="panel flex h-fit flex-col gap-5 p-5">
            <div>
              <label className="mono mb-2 block text-[10px] uppercase tracking-widest text-muted-foreground">
                Plaintext (max 12)
              </label>
              <input
                value={raw}
                onChange={(e) => setRaw(e.target.value.toUpperCase().slice(0, 12))}
                className="mono w-full rounded-sm border border-border bg-background px-3 py-2 text-base outline-none focus:border-amber"
                spellCheck={false}
              />
            </div>

            <RangeRow label={`Permutation size  n = ${n}`} min={6} max={12} value={n} onChange={setN} />
            <RangeRow label={`Rounds  k = ${k}`} min={2} max={8} value={k} onChange={setK} />
            <RangeRow label={`Key seed = ${seed}`} min={1} max={999} value={seed} onChange={setSeed} />

            <div>
              <label className="mono mb-2 block text-[10px] uppercase tracking-widest text-muted-foreground">
                Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMode("enc")}
                  className={`mono rounded-sm border px-3 py-2 text-xs uppercase tracking-widest transition ${
                    mode === "enc"
                      ? "border-amber bg-amber text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Encrypt
                </button>
                <button
                  onClick={() => setMode("dec")}
                  className={`mono rounded-sm border px-3 py-2 text-xs uppercase tracking-widest transition ${
                    mode === "dec"
                      ? "border-teal bg-teal text-secondary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Decrypt
                </button>
              </div>
            </div>

            <button
              onClick={() => setSeed((s) => (s % 999) + 7)}
              className="mono rounded-sm border border-border px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:border-amber hover:text-amber"
            >
              ↻ Re-roll round keys
            </button>

            <div className="rounded-sm border border-border bg-background/40 p-3">
              <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Group size · |Sₙ|
              </div>
              <div className="mono mt-1 text-lg">{factorial(n).toLocaleString()}</div>
              <div className="mono mt-1 text-[10px] text-muted-foreground">
                possible round keys at this n
              </div>
            </div>
          </aside>

          {/* Main visualization */}
          <section className="panel p-6">
            <RoundsView trace={trace} text={text} keys={keys} mode={mode} />

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <ResultCard
                label={mode === "enc" ? "Ciphertext" : "Recovered Plaintext"}
                value={final}
                mode={mode}
                onCopy={copy}
              />
              <div className="panel border-border bg-background/40 p-4">
                <div className="mono mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                  Avalanche map
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {avalanche.map((changed, i) => (
                    <div
                      key={i}
                      className="mono flex h-7 w-7 items-center justify-center rounded-sm text-[10px]"
                      style={{
                        background: changed
                          ? "color-mix(in oklab, var(--destructive) 35%, transparent)"
                          : "color-mix(in oklab, var(--teal) 30%, transparent)",
                        color: changed ? "var(--destructive)" : "var(--teal)",
                      }}
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div className="mono mt-3 flex justify-between text-[11px] text-muted-foreground">
                  <span>displaced: {displaced}/{n}</span>
                  <span>ratio: {((displaced / n) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="mono mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                Round keys
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {keys.map((kk, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="mono rounded-sm border border-border bg-background/40 px-3 py-2 text-[11px]"
                  >
                    <span className="text-amber">K{sub(i + 1)}</span>{" "}
                    = [{kk.map((v, j) => `${j}→${v}`).join(", ")}]
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mono mt-8 border-t border-border pt-4 text-[11px] text-muted-foreground">
              {mode === "enc"
                ? `Enc(x) = (K${sub(k)} ∘ … ∘ K₁)(x)`
                : `Dec(y) = (K₁⁻¹ ∘ … ∘ K${sub(k)}⁻¹)(y)`}
              {" — "}
              applied as a single transformation pipeline over {rounds.length - 1} rounds.
            </div>
          </section>
        </div>

        <p className="mono mt-10 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          Educational visualization · not a cryptographically secure cipher
        </p>
      </main>
    </div>
  );
}

function sub(n: number) {
  const map: Record<string, string> = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉" };
  return String(n).split("").map((c) => map[c] ?? c).join("");
}

function RangeRow({
  label, min, max, value, onChange,
}: { label: string; min: number; max: number; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="mono mb-2 block text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[color:var(--amber)]"
      />
    </div>
  );
}

function ResultCard({
  label, value, mode, onCopy,
}: { label: string; value: string; mode: "enc" | "dec"; onCopy: () => void }) {
  const cls = mode === "enc" ? "text-amber glow-amber border-amber" : "text-teal glow-teal border-teal";
  return (
    <div className={`panel p-4 ${cls.split(" ").pop()}`}>
      <div className="mono mb-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <button onClick={onCopy} className="hover:text-foreground">copy ↗</button>
      </div>
      <div className={`mono break-all text-2xl font-semibold ${cls}`}>{value}</div>
    </div>
  );
}
