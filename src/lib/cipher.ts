// CipherGuard core algorithms — pure permutation-based reversible cipher.
// Educational only. Not cryptographically secure.

export type Perm = number[];

// Fisher–Yates seeded shuffle to derive a permutation from an integer key.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generatePermutation(n: number, seed = Date.now()): Perm {
  const rand = mulberry32(seed);
  const p = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  return p;
}

// inverse[p[i]] = i
export function inverse(p: Perm): Perm {
  const inv = new Array(p.length);
  for (let i = 0; i < p.length; i++) inv[p[i]] = i;
  return inv;
}

// (a ∘ b)(i) = a[b[i]]
export function compose(a: Perm, b: Perm): Perm {
  return b.map((bi) => a[bi]);
}

// Apply perm to a string of length n: out[i] = text[p[i]]
export function applyPerm(text: string, p: Perm): string {
  return p.map((i) => text[i] ?? "·").join("");
}

// Derive k round keys deterministically from a base seed.
export function roundKeys(baseSeed: number, n: number, k: number): Perm[] {
  return Array.from({ length: k }, (_, r) =>
    generatePermutation(n, baseSeed + (r + 1) * 9973),
  );
}

export function padText(text: string, n: number): string {
  const t = text.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, n);
  return t.padEnd(n, "·");
}

export function encrypt(text: string, keys: Perm[]): { final: string; rounds: string[] } {
  const rounds: string[] = [text];
  let cur = text;
  for (const k of keys) {
    cur = applyPerm(cur, k);
    rounds.push(cur);
  }
  return { final: cur, rounds };
}

export function decrypt(text: string, keys: Perm[]): { final: string; rounds: string[] } {
  const rounds: string[] = [text];
  let cur = text;
  for (let i = keys.length - 1; i >= 0; i--) {
    cur = applyPerm(cur, inverse(keys[i]));
    rounds.push(cur);
  }
  return { final: cur, rounds };
}

// Track index movement across rounds: per round, originIndex[pos] = original index
export function traceIndices(n: number, keys: Perm[], mode: "enc" | "dec"): number[][] {
  const trace: number[][] = [];
  let cur = Array.from({ length: n }, (_, i) => i);
  trace.push([...cur]);
  if (mode === "enc") {
    for (const k of keys) {
      cur = k.map((i) => cur[i]);
      trace.push([...cur]);
    }
  } else {
    for (let i = keys.length - 1; i >= 0; i--) {
      const inv = inverse(keys[i]);
      cur = inv.map((ix) => cur[ix]);
      trace.push([...cur]);
    }
  }
  return trace;
}

// Factorial for key space
export function factorial(n: number): number {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

// Cycle notation: returns array of cycles, each a list of indices.
export function cycles(p: Perm): number[][] {
  const seen = new Array(p.length).fill(false);
  const out: number[][] = [];
  for (let i = 0; i < p.length; i++) {
    if (seen[i]) continue;
    const cyc: number[] = [];
    let j = i;
    while (!seen[j]) {
      seen[j] = true;
      cyc.push(j);
      j = p[j];
    }
    if (cyc.length > 1) out.push(cyc);
  }
  return out;
}

export function cycleNotation(p: Perm): string {
  const c = cycles(p);
  if (c.length === 0) return "e (identity)";
  return c.map((cy) => `(${cy.join(" ")})`).join("");
}

// Cayley table for a list of group elements (by index).
export function cayleyTable(elements: Perm[]): number[][] {
  const key = (p: Perm) => p.join(",");
  const idx = new Map(elements.map((e, i) => [key(e), i]));
  return elements.map((a) => elements.map((b) => idx.get(key(compose(a, b))) ?? -1));
}

// Generate small symmetric subgroup for visualization (first m perms of S_n).
export function smallGroup(n: number, m: number): Perm[] {
  // Generate all permutations of n via Heap's algorithm but cap at m.
  const out: Perm[] = [];
  const a = Array.from({ length: n }, (_, i) => i);
  const c = new Array(n).fill(0);
  out.push([...a]);
  let i = 0;
  while (i < n && out.length < m) {
    if (c[i] < i) {
      if (i % 2 === 0) [a[0], a[i]] = [a[i], a[0]];
      else [a[c[i]], a[i]] = [a[i], a[c[i]]];
      out.push([...a]);
      c[i]++;
      i = 0;
    } else {
      c[i] = 0;
      i++;
    }
  }
  return out;
}
