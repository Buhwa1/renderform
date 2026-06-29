import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const styles: Record<string, React.CSSProperties> = {
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "inherit",
    fontWeight: 500,
    borderRadius: "8px",
    border: "1px solid transparent",
    cursor: "pointer",
    transition: "all 0.15s ease",
    outline: "none",
    userSelect: "none",
    whiteSpace: "nowrap",
    textDecoration: "none",
  },
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderColor: "#2563eb",
  },
  secondary: {
    backgroundColor: "#f1f5f9",
    color: "#0f172a",
    borderColor: "#e2e8f0",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#374151",
    borderColor: "transparent",
  },
  danger: {
    backgroundColor: "#dc2626",
    color: "#ffffff",
    borderColor: "#dc2626",
  },
  outline: {
    backgroundColor: "transparent",
    color: "#2563eb",
    borderColor: "#2563eb",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "6px 12px", fontSize: "13px", lineHeight: "18px" },
  md: { padding: "9px 16px", fontSize: "14px", lineHeight: "20px" },
  lg: { padding: "11px 20px", fontSize: "16px", lineHeight: "24px" },
};

const Spinner = ({ size }: { size: ButtonSize }) => {
  const dim = size === "sm" ? 12 : size === "md" ? 14 : 16;
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      style={{ animation: "button-spin 0.7s linear infinite", flexShrink: 0 }}
    >
      <style>{`@keyframes button-spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      style,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const computedStyle: React.CSSProperties = {
      ...styles.base,
      ...variantStyles[variant],
      ...sizeStyles[size],
      width: fullWidth ? "100%" : undefined,
      opacity: isDisabled ? 0.55 : 1,
      cursor: isDisabled ? "not-allowed" : "pointer",
      ...style,
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        style={computedStyle}
        {...rest}
      >
        {loading ? (
          <Spinner size={size} />
        ) : leftIcon ? (
          <span style={{ display: "inline-flex", flexShrink: 0 }}>{leftIcon}</span>
        ) : null}
        {children}
        {!loading && rightIcon && (
          <span style={{ display: "inline-flex", flexShrink: 0 }}>{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;