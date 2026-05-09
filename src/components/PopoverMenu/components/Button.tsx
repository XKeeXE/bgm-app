import { usePopoverMenu } from "../PopoverMenu";
import { ButtonItem } from "../types";

const Button = ({
  className = "",
  isActive = false,
  disabled = false,
  iconOnly = false,
  closeOnClick = true,
  onClick,
  ...props
}: ButtonItem) => {
  const { closePopoverMenu } = usePopoverMenu()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent focus loss
    if (!disabled && onClick) {
      onClick(e);
      if (closeOnClick) {
        closePopoverMenu();
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent focus loss
  };

  const buttonClass = `flex items-center  ${
    isActive
      ? "!bg-blue-500 text-white"
      : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-[#212121] dark:text-white dark:hover:bg-[#333333]"
  } ${
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  } ${className}`;

  return (
    <button
      disabled={disabled}
      className={buttonClass}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      {...props}
    >
      {props.icon && <span className="mr-2">{props.icon}</span>}
      {!iconOnly && <span>{props.label}</span>}
    </button>
  );
};

export default Button;