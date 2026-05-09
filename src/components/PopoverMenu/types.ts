export interface PopoverMenuProps {
  x: number;
  y: number;
  config?: PopoverMenuConfig;
  onClose: () => void;
}

export interface PopoverMenuConfig {
  id: string;
  items: PopoverMenuItem[];
  orientation?: "vertical" | "horizontal";
  className?: string;
  autoCloseDelay?: number;
}

export type PopoverMenuItem = ButtonItem | SeparatorItem | DropdownItem;

export type PopoverMenuItemType = "button" | "separator" | "dropdown";

export interface PopoverMenuItemBase {
  type: PopoverMenuItemType;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export interface ButtonItem extends PopoverMenuItemBase {
  type: "button";
  icon?: React.ReactNode;
  label?: string;
  iconOnly?: boolean;
  isActive?: boolean;
  closeOnClick?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface SeparatorItem extends PopoverMenuItemBase {
  type: "separator";
}

export interface DropdownItem
  extends PopoverMenuItemBase,
    Omit<ButtonItem, "type"> {
  type: "dropdown";
  config?: PopoverMenuConfig;
}
