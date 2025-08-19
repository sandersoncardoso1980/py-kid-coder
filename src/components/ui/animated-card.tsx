import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "primary" | "secondary" | "accent";
  onClick?: () => void;
}

export function AnimatedCard({ 
  children, 
  className, 
  variant = "default",
  onClick 
}: AnimatedCardProps) {
  const variants = {
    default: "bg-card border border-border shadow-card",
    primary: "bg-gradient-primary text-primary-foreground shadow-hover",
    secondary: "bg-gradient-secondary text-secondary-foreground shadow-hover", 
    accent: "bg-gradient-accent text-accent-foreground shadow-hover"
  };

  return (
    <div
      className={cn(
        "rounded-lg p-6 transition-all duration-300 hover:shadow-hover hover:scale-105 cursor-pointer",
        variants[variant],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}