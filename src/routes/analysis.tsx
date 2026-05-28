import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Nav } from "@/components/cipher/Nav";
import { factorial } from "@/lib/cipher";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "Algorithm Analysis — CipherGuard" },
      { name: "description", content: "Complexity, Transform & Conquer paradigm, and empirical timing of the permutation cipher." },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const timing = useMemo(() => {
    const sizes = [8, 16, 32, 64, 128, 256, 512, 1024];
    const k = 6;
    return sizes.map((n) => {
      const perm = Array.from({ length: n }, (_, i) => (i * 7 + 3) % n);
      const text = "X".repeat(n);
      const t0 = performance.now();
      for (let it = 0; it < 200; it++) {
        let cur = text;
        for (let r = 0; r < k; r++) cur = perm.map((i) => cur[i]).join("");
      }
      const t1 = performance.now();
      return { n, ms: +(t1 - t0).toFixed(2) };
    });
  }, []);

  const keyspace = useMemo(
    () => [6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => ({ n, bits: +Math.log2(factorial(n)).toFixed(2) })),
    [],
  );

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <div className="mono text-xs tracking-[0.3em] text-muted-foreground">§04 · ALGORITHM ANALYSIS</div>
          <h1 className="mt-2 font-display text-4xl">
            Transform &amp; Conquer, <span className="italic text-amber">measured</span>.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            The cipher solves a hard problem (mixing positions) by repeatedly applying a simple, cheap
            transformation. Each round costs O(n); k rounds cost O(k·n). Inversion is symmetric.
          </p>
        </div>

        {/* Complexity table */}
        <section className="panel mb-6 p-5">
          <div className="mono mb-4 text-[10px] uppercase tracking-widest text-muted-foreground">
            Asymptotic complexity
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["generatePermutation(n)", "O(n)", "Fisher–Yates seeded shuffle"],
              ["inverse(P)", "O(n)", "single pass: inv[P[i]] = i"],
              ["compose(P, Q)", "O(n)", "out[i] = P[Q[i]]"],
              ["encrypt(text, K₁…Kₖ)", "O(k·n)", "k rounds of an O(n) rewrite"],
              ["decrypt(text, K₁…Kₖ)", "O(k·n)", "k inverse rounds in reverse order"],
              ["cayleyTable(G)", "O(|G|²·n)", "compose every pair, lookup in hash map"],
            ].map(([fn, big, note]) => (
              <div key={fn} className="rounded-sm border border-border bg-background/40 p-3">
                <div className="mono text-sm">
                  <span className="text-amber">{fn}</span>
                  <span className="ml-2 text-teal">{big}</span>
                </div>
                <div className="mono mt-1 text-[11px] text-muted-foreground">{note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Transform & Conquer diagram */}
        <section className="panel mb-6 p-6">
          <div className="mono mb-4 text-[10px] uppercase tracking-widest text-muted-foreground">
            Transform &amp; Conquer pipeline
          </div>
          <div className="mono grid grid-cols-1 items-center gap-2 text-sm md:grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto]">
            <Pill>Input</Pill>
            <Arrow label="K₁ : O(n)" />
            <Pill>Round 1</Pill>
            <Arrow label="K₂ : O(n)" />
            <Pill>Round 2</Pill>
            <Arrow label="… Kₖ" />
            <Pill accent>Output</Pill>
          </div>
          <p className="mono mt-4 text-xs text-muted-foreground">
            Each transform is reversible; the inverse pipeline runs the same diagram right-to-left with K⁻¹ᵢ.
          </p>
        </section>

        {/* Charts */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="panel p-5">
            <div className="mono mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              Empirical timing · 200 iterations × 6 rounds
            </div>
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={timing} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis dataKey="n" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }}
                    labelStyle={{ color: "var(--muted-foreground)" }}
                  />
                  <Line type="monotone" dataKey="ms" stroke="var(--amber)" strokeWidth={2} dot={{ fill: "var(--amber)", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mono mt-2 text-[11px] text-muted-foreground">
              Linear growth in n confirms the O(k·n) bound.
            </div>
          </div>

          <div className="panel p-5">
            <div className="mono mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              Key space · log₂(n!) bits
            </div>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={keyspace} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis dataKey="n" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }}
                    labelStyle={{ color: "var(--muted-foreground)" }}
                  />
                  <Bar dataKey="bits" fill="var(--teal)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mono mt-2 text-[11px] text-muted-foreground">
              Super-exponential growth — but still tiny vs modern cipher key sizes.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Pill({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      className={`rounded-sm border px-4 py-3 text-center ${
        accent ? "border-amber text-amber" : "border-border text-foreground"
      }`}
    >
      {children}
    </div>
  );
}

function Arrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center text-muted-foreground">
      <div className="text-[10px]">{label}</div>
      <div className="text-lg">→</div>
    </div>
  );
}
