import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({ variant = "ghost", children, style, className, ...rest }: ButtonProps) {
  const base = "rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variantStyle =
    variant === "primary"
      ? { background: "var(--accent)", color: "white", border: "1px solid var(--accent)" }
      : variant === "danger"
        ? { background: "transparent", color: "var(--error)", border: "1px solid var(--line)" }
        : { background: "var(--panel)", color: "var(--ink)", border: "1px solid var(--line)" };
  return (
    <button
      {...rest}
      className={`${base} ${className ?? ""}`}
      style={{ ...variantStyle, ...style }}
    >
      {children}
    </button>
  );
}
