import { Link } from "@tanstack/react-router";

const items = [
  { to: "/", label: "Lab" },
  { to: "/group", label: "Group Theory" },
  { to: "/proof", label: "Proof" },
  { to: "/analysis", label: "Analysis" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="mono text-amber text-lg font-bold">⌬</div>
          <div>
            <div className="font-display text-lg leading-none">CipherGuard</div>
            <div className="mono text-[10px] tracking-widest text-muted-foreground">
              PERMUTATION CIPHER LABORATORY
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className="mono px-3 py-1.5 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-amber" }}
              activeOptions={{ exact: true }}
            >
              {it.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
