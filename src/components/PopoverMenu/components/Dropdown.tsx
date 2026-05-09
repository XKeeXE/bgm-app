import { useRef } from "react";
import { DropdownItem } from "../types";
import Button from "./Button";
import { usePopoverMenu } from "../PopoverMenu";

const Dropdown = ({
  className = "",
  isActive = false,
  disabled = false,
  iconOnly = false,
  closeOnClick: hideOnClick = false,
  config,
  ...props
}: DropdownItem) => {
  const { showPopoverMenu } = usePopoverMenu();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownClick = () => {
    if (dropdownRef.current && config) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const x = rect.right;
      const y = rect.top;

      // The config for the new menu comes from the 'config' prop
      // Pass the dropdown element as the trigger context
      showPopoverMenu(x, y, config, { trigger: dropdownRef.current });
    }
  };

  return (
    <div ref={dropdownRef}>
      <Button
        className={className}
        {...props}
        closeOnClick={hideOnClick}
        onClick={(e) => {
          e.stopPropagation();
          handleDropdownClick();
        }}
        type={"button"}
        id={props.id}
      />
    </div>
  );
};

export default Dropdown;
