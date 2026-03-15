import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline" | "ghost";
  icon?: LucideIcon;
}

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SIZE CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const SIZE_CONFIG = {
  sm: {
    container: "py-10",
    iconWrapper: "h-12 w-12",
    icon: "h-6 w-6",
    title: "text-sm font-semibold",
    description: "text-xs max-w-xs",
  },
  md: {
    container: "py-16",
    iconWrapper: "h-16 w-16",
    icon: "h-8 w-8",
    title: "text-base font-semibold",
    description: "text-sm max-w-sm",
  },
  lg: {
    container: "py-24",
    iconWrapper: "h-20 w-20",
    icon: "h-10 w-10",
    title: "text-xl font-bold",
    description: "text-base max-w-md",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ACTION BUTTON
// ─────────────────────────────────────────────────────────────────────────────

function ActionButton({
  action,
  isSecondary = false,
}: {
  action: EmptyStateAction;
  isSecondary?: boolean;
}) {
  const Icon = action.icon;
  const variant =
    action.variant ?? (isSecondary ? "outline" : "default");

  const content = (
    <Button
      variant={variant}
      onClick={action.onClick}
      className={cn(
        !isSecondary &&
          "bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
      )}
    >
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {action.label}
    </Button>
  );

  if (action.href) {
    return (
      <a href={action.href} className="inline-flex">
        {content}
      </a>
    );
  }

  return content;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  className,
}: EmptyStateProps) {
  const sizes = SIZE_CONFIG[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center w-full",
        sizes.container,
        className
      )}
      role="status"
      aria-label={title}
    >
      {/* Icon */}
      <div
        className={cn(
          "rounded-2xl bg-slate-100 flex items-center justify-center mb-5",
          sizes.iconWrapper
        )}
      >
        <Icon
          className={cn("text-slate-400", sizes.icon)}
          strokeWidth={1.5}
        />
      </div>

      {/* Text */}
      <h3 className={cn("text-slate-900 mb-2", sizes.title)}>{title}</h3>
      {description && (
        <p className={cn("text-slate-500 leading-relaxed mx-auto", sizes.description)}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
          {action && <ActionButton action={action} />}
          {secondaryAction && (
            <ActionButton action={secondaryAction} isSecondary />
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
