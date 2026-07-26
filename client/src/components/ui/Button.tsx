import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary: "border border-black bg-black text-white hover:bg-gray-800",

      secondary:
        "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100",

      ghost:
        "border border-transparent bg-transparent text-gray-900 hover:bg-gray-100",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",

      md: "h-10 px-4 py-2 text-sm",

      lg: "h-11 px-8 text-lg",
    };

    const combinedClassName = [
      baseStyles,
      variants[variant],
      sizes[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return <button ref={ref} className={combinedClassName} {...props} />;
  },
);

Button.displayName = "Button";
