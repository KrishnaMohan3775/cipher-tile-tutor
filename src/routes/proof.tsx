import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/cipher/Nav";
import { factorial } from "@/lib/cipher";

export const Route = createFileRoute("/proof")({
  head: () => ({
    meta: [
      { title: "Mathematical Proof — CipherGuard" },
      { name: "description", content: "Reversibility, composition, and key space for the permutation cipher." },
    ],
  }),
  component: ProofPage,
});

function ProofPage() {
  const sizes = [6, 8, 10, 12, 14];
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-10">
          <div className="mono text-xs tracking-[0.3em] text-muted-foreground">§03 · MATHEMATICAL PROOF</div>
          <h1 className="mt-2 font-display text-4xl">
            Three theorems that <span className="italic text-amber">make it work</span>.
          </h1>
        </div>

        <Theorem
          title="Theorem 1 — Reversibility"
          statement="For any round keys K₁,…,Kₖ ∈ Sₙ, the decryption function recovers the original plaintext."
        >
          <Block>
            <Line>Enc = K<sub>k</sub> ∘ K<sub>k−1</sub> ∘ … ∘ K₁</Line>
            <Line>Dec = K₁⁻¹ ∘ K₂⁻¹ ∘ … ∘ K<sub>k</sub>⁻¹</Line>
            <Line className="text-muted-foreground">────────────────────────────</Line>
            <Line>Dec ∘ Enc = (K₁⁻¹∘…∘K<sub>k</sub>⁻¹) ∘ (K<sub>k</sub>∘…∘K₁)</Line>
            <Line className="text-teal">         = K₁⁻¹ ∘ … ∘ (K<sub>k</sub>⁻¹ ∘ K<sub>k</sub>) ∘ … ∘ K₁</Line>
            <Line className="text-teal">         = K₁⁻¹ ∘ … ∘ K<sub>k−1</sub>⁻¹ ∘ e ∘ K<sub>k−1</sub> ∘ … ∘ K₁</Line>
            <Line className="text-teal">         = K₁⁻¹ ∘ K₁  =  e</Line>
            <Line className="text-amber">∴ Dec(Enc(x)) = e(x) = x  ∎</Line>
          </Block>
          <p className="mt-3 text-sm text-muted-foreground">
            Each inverse pair collapses to the identity by associativity — the same principle the Lab verifies live.
          </p>
        </Theorem>

        <Theorem
          title="Theorem 2 — Composition is a single permutation"
          statement="The full encryption is itself an element of Sₙ; the k rounds are mathematically equivalent to one carefully chosen permutation."
        >
          <Block>
            <Line>Enc ∈ Sₙ  (closure under composition)</Line>
            <Line>For all x: Enc(x) = (K<sub>k</sub>∘…∘K₁)(x)</Line>
            <Line className="text-amber">⇒ rounds add diffusion, not new expressive power.</Line>
          </Block>
          <p className="mt-3 text-sm text-muted-foreground">
            This is why we don't claim cryptographic strength — but it is exactly what makes the
            Transform &amp; Conquer paradigm legible: stack reversible transforms, decompose the inverse.
          </p>
        </Theorem>

        <Theorem
          title="Theorem 3 — Key space size"
          statement="The number of possible round keys at size n is |Sₙ| = n!."
        >
          <div className="panel mt-2 overflow-hidden">
            <table className="mono w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="px-4 py-2">n</th>
                  <th className="px-4 py-2">|Sₙ| = n!</th>
                  <th className="px-4 py-2">bits ≈ log₂(n!)</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((n) => {
                  const f = factorial(n);
                  return (
                    <tr key={n} className="border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-2 text-amber">{n}</td>
                      <td className="px-4 py-2">{f.toLocaleString()}</td>
                      <td className="px-4 py-2 text-muted-foreground">{Math.log2(f).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Theorem>
      </main>
    </div>
  );
}

function Theorem({
  title, statement, children,
}: { title: string; statement: string; children: React.ReactNode }) {
  return (
    <section className="panel mb-8 p-6">
      <div className="mono text-[10px] uppercase tracking-widest text-amber">{title.split(" — ")[0]}</div>
      <h2 className="mt-1 font-display text-2xl">{title.split(" — ")[1]}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{statement}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Block({ children }: { children: React.ReactNode }) {
  return (
    <div className="mono rounded-sm border border-border bg-background/40 p-4 text-[13px] leading-7">
      {children}
    </div>
  );
}

function Line({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
