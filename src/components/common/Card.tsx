import type { ReactNode } from "react";
import clsx from "classnames";

type CardProps = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
};

export default function Card({
  children,
  className,
  interactive = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-white border border-gray-100 rounded-xl shadow-card transition-all duration-200",
        interactive && "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
