import { memo } from "react";

interface IconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  className?: string;
  tooltip?: string;
  tooltipClassName?: string;
}

const Icon = memo(
  ({ icon, className = "", tooltip, tooltipClassName = "left-[135%]", ...props }: IconProps) => {
    return (
      <button
        tabIndex={-1}
        className={`relative flex items-center justify-center ${tooltip ? 'tooltip' : ''} ${className}`}
        {...props}
      >
        {icon}
        {tooltip && <span className={`tooltiptext ${tooltipClassName}`}>{tooltip}</span>}
      </button>
    );
  },
);

export default Icon;
