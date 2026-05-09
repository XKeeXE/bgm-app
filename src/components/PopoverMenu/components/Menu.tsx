import { useEffect, useRef, useState } from "react";
import { MenuInstance, usePopoverMenu } from "../PopoverMenu";
import Button from "./Button";
import Seperator from "./Seperator";
import Dropdown from "./Dropdown";

const ButtonStyle = "w-full px-3 py-2 text-left text-sm";

const POPOVERMENU_ID = "popover-menu";

interface PopoverMenuItemProps {
  menu: MenuInstance;
}

const Menu = ({ menu }: PopoverMenuItemProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    x: menu.position.x,
    y: menu.position.y,
  });
  const { closeAllPopoverMenus, closePopoverMenu } = usePopoverMenu();
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { trigger, container } = menu.context;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is inside any popover menu
      const allPopoverMenus = document.querySelectorAll(`#${POPOVERMENU_ID}`);

      const clickedInsideAnyMenu = Array.from(allPopoverMenus).some(
        (menuElement) => menuElement.contains(target)
      );

      // Check if click is on the specific trigger button or container associated with this menu
      const clickedOnContainer = container?.contains(target);
      const clickedOnTrigger = trigger?.contains(target);

      if (!clickedInsideAnyMenu && !clickedOnTrigger && !clickedOnContainer) {
        closeAllPopoverMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [trigger, container, closeAllPopoverMenus]);

  // Handle menu hover auto-close
  useEffect(() => {
    if (!menu.config.autoCloseDelay) return;

    const handleMouseLeave = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as Node;

      // Don't close if moving back to the specific container or trigger
      const isMovingToContainer = container?.contains(relatedTarget);
      const isMovingToTrigger = trigger?.contains(relatedTarget);

      if (isMovingToContainer || isMovingToTrigger) {
        return;
      }

      // Clear any existing timeout
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }

      // Set new timeout to close menu
      autoCloseTimeoutRef.current = setTimeout(() => {
        closePopoverMenu(menu.config.id);
      }, menu.config.autoCloseDelay);
    };

    const handleMouseEnter = () => {
      // Cancel auto-close if user returns to menu
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
        autoCloseTimeoutRef.current = null;
      }
    };

    const menuElement = menuRef.current;
    if (menuElement) {
      menuElement.addEventListener("mouseenter", handleMouseEnter);
      menuElement.addEventListener(
        "mouseleave",
        handleMouseLeave as EventListener
      );
    }

    return () => {
      if (menuElement) {
        menuElement.removeEventListener("mouseenter", handleMouseEnter);
        menuElement.removeEventListener(
          "mouseleave",
          handleMouseLeave as EventListener
        );
      }
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }
    };
  }, [
    menu.config.autoCloseDelay,
    menu.config.id,
    container,
    trigger,
    closePopoverMenu,
  ]);

  // Handle container leave events
  useEffect(() => {
    if (!container) return;

    const handleParentMouseLeave = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement;

      // Don't close if moving to the popover menu
      if (relatedTarget?.closest(`#${POPOVERMENU_ID}`)) {
        return;
      }

      // Clear any existing timeout
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }

      // Set shorter timeout for sidebar leave (100ms)
      autoCloseTimeoutRef.current = setTimeout(() => {
        closeAllPopoverMenus();
      }, 100);
    };

    // Listen to mouseleave on the container element
    container.addEventListener(
      "mouseleave",
      handleParentMouseLeave as EventListener
    );

    return () => {
      container.removeEventListener(
        "mouseleave",
        handleParentMouseLeave as EventListener
      );
    };
  }, [container, closeAllPopoverMenus]);

  useEffect(() => {
    if (!menuRef.current) return;
    const menuRect = menuRef.current.getBoundingClientRect();

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = menu.position.x;
    let adjustedY = menu.position.y;

    // Check if menu goes beyond right edge
    if (menu.position.x + menuRect.width > viewportWidth) {
      adjustedX = viewportWidth - menuRect.width - 10; // 10px padding from edge
    }

    // Check if menu goes beyond bottom edge
    if (menu.position.y + menuRect.height > viewportHeight) {
      adjustedY = viewportHeight - menuRect.height - 10; // 10px padding from edge
    }

    // Check if menu goes beyond left edge
    if (adjustedX < 10) {
      adjustedX = 10;
    }

    // Check if menu goes beyond top edge
    if (adjustedY < 10) {
      adjustedY = 10;
    }
    setPosition({ x: adjustedX, y: adjustedY });
  }, [menu.position.x, menu.position.y]);

  return (
    <div
      ref={menuRef}
      id={POPOVERMENU_ID}
      className={`fixed border border-gray-200 bg-white dark:border-[#333333] dark:bg-[#212121] rounded-lg shadow-lg overflow-hidden min-w-[180px] flex z-[999] ${
        menu.config.className ?? ""
      } ${menu.config.orientation === "horizontal" ? "flex-row" : "flex-col"}`}
      style={{ top: position.y, left: position.x }}
    >
      {menu.config.items.map((item, index) => {
        const itemKey = item.id ?? `${menu.config.id}-${item.type}-${index}`;

        switch (item.type) {
          case "button":
            return <Button key={itemKey} {...item} className={ButtonStyle} />;
          case "separator":
            return (
              <Seperator
                key={itemKey}
                {...item}
                orientation={menu.config.orientation ?? "vertical"}
              />
            );
          case "dropdown":
            return <Dropdown key={itemKey} {...item} className={ButtonStyle} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default Menu;