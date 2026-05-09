# PopoverMenu Component

The `PopoverMenu` component is a flexible and interactive context menu system built with Zustand state management. It provides a declarative way to render floating menus that can be triggered from any element in your application, with built-in support for auto-closing, viewport boundary detection, and precise "safe zone" management using DOM references.

## Features

- **Global State Management**: Uses Zustand to manage menu state, allowing any component to trigger menus without prop drilling.
- **Reference-Based Context**: Explicitly links menus to their trigger and container elements via DOM references, eliminating the need for brittle string IDs.
- **Multiple Menu Types**: Out-of-the-box support for `button`, `separator`, and `dropdown` menu items.
- **Smart Auto-Close**: Configurable auto-close behavior that intelligently respects specific trigger elements and parent containers (like sidebars).
- **Viewport Awareness**: Automatically adjusts menu position to stay within viewport boundaries.
- **Nested Menu Support**: Handles interactions between parent containers, triggers, and menus seamlessly.

## Architecture

The `PopoverMenu` is composed of several key parts:

- **`PopoverMenu.tsx`**: The main module that provides the Zustand store, hooks, and the `PopoverMenuRenderer` component. It manages the global state and DOM context of active menus.
- **`components/Menu.tsx`**: The core menu component that handles rendering, positioning, and event listeners. It uses stored DOM references to determine "safe zones" for hover interactions.
- **`components/`**: The directory containing the building blocks for menu items:
  - **`Button.tsx`**: Renders clickable menu buttons with optional icons and labels.
  - **`Separator.tsx`**: Renders visual separators between menu items.
  - **`Dropdown.tsx`**: Renders nested dropdown menu items.
- **`types.ts`**: Defines the public API contract for menu configurations and items.

## State Management and Usage

The system is designed to be stateless from the consumer's perspective regarding the menu's existence. You simply call `showPopoverMenu` with a position, configuration, and optional DOM context.

## Public API

### Critical Components

#### `PopoverMenuRenderer`

The renderer component that must be placed once in your application (typically in your main layout or page component). It requires no props. It simply renders active menus from the store.

```tsx

<PopoverMenuRenderer />
```

#### `usePopoverMenu` Hook

Returns methods to control popover menus from any component.

| Method                 | Type                                                                                         | Description                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `showPopoverMenu`      | `(x: number, y: number, config: PopoverMenuConfig, context?: PopoverMenuContext) => void`   | Opens a menu at the specified position with configuration and DOM context. |
| `closePopoverMenu`     | `(id?: string) => void`                                                                      | Closes a specific menu by ID, or the most recent menu if no ID provided. |
| `closeAllPopoverMenus` | `() => void`                                                                                 | Closes all active menus.                                            |

### `PopoverMenuContext`

An optional object passed to `showPopoverMenu` to define the "safe zones" for the menu. This prevents the menu from closing when the user moves their mouse back to the trigger or the parent container.

```typescript
interface PopoverMenuContext {
  trigger?: HTMLElement | null;   // The specific button that opened the menu
  container?: HTMLElement | null; // The parent container (e.g., Sidebar)
}
```

### `PopoverMenuConfig`

The configuration object that defines how a menu should appear and behave:

```typescript
interface PopoverMenuConfig {
  id: string;                              // Unique identifier for the menu
  items: PopoverMenuItem[];                // Array of menu items to render
  orientation?: "vertical" | "horizontal"; // Layout orientation (default: "vertical")
  className?: string;                      // Additional CSS classes
  autoCloseDelay?: number;                 // Delay in ms before auto-closing on mouse leave
}
```

### `PopoverMenuItem`

Menu items can be one of three types:

#### Button Item
```typescript
{
  type: "button";
  id?: string;
  icon?: React.ReactNode;
  label?: string;
  iconOnly?: boolean;
  isActive?: boolean;
  closeOnClick?: boolean;    // Whether to close menu when clicked
  disabled?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
```

#### Separator Item
```typescript
{
  type: "separator";
  id?: string;
  className?: string;
}
```

#### Dropdown Item (Nested Menu)
```typescript
{
  type: "dropdown";
  id?: string;
  icon?: React.ReactNode;
  label?: string;
  config?: PopoverMenuConfig;  // Configuration for the nested menu
  disabled?: boolean;
  className?: string;
  // ... other ButtonItem properties
}
```

## Usage

### 1. Setup the Renderer

Add the `PopoverMenuRenderer` to your application root. 

```tsx
import PopoverMenuRenderer from "@/components/PopoverMenu/PopoverMenu";

export default function MyApp() {
  return (
    <div>
      {/* Your app content */}
      <PopoverMenuRenderer />
    </div>
  );
}
```

### 2. Trigger Menus with Context

Use the `usePopoverMenu` hook. When opening a menu, you can pass the `currentTarget` (trigger) and a ref to the container.

```tsx
import { useRef } from "react";
import { usePopoverMenu } from "@/components/PopoverMenu/PopoverMenu";

function Sidebar() {
  const { showPopoverMenu, closeAllPopoverMenus } = usePopoverMenu();
  
  // 1. Create a ref for the container (optional, but recommended for Sidebars)
  const containerRef = useRef<HTMLDivElement>(null);

  const handleShowMenu = (e: React.MouseEvent<HTMLElement>) => {
    const trigger = e.currentTarget; // The specific button hovered
    const rect = trigger.getBoundingClientRect();
    
    // 2. Pass the context when showing the menu
    showPopoverMenu(
      rect.right, 
      rect.top, 
      {
        id: "my-menu",
        items: [/* ... items ... */],
        autoCloseDelay: 300,
      },
      {
        trigger: trigger,
        container: containerRef.current
      }
    );
  };

  return (
    <div ref={containerRef} className="sidebar">
      <button onMouseEnter={handleShowMenu}>
        Open Menu
      </button>
    </div>
  );
}
```

## Advanced Usage

### Auto-Close Behavior Logic

The menu system uses the passed context to handle sophisticated auto-close scenarios:

1. **Mouse Leave Menu**: When the mouse leaves the menu, a timer starts (`autoCloseDelay`).
2. **Safety Check**: Before closing, the system checks where the mouse went (`relatedTarget`).
   - If mouse moved to **Trigger** (`context.trigger`): Timer is cancelled. Menu stays open.
   - If mouse moved to **Container** (`context.container`): Timer is cancelled. Menu stays open.
   - If mouse moved elsewhere: Menu closes.
3. **Container Leave**: If the mouse leaves the container (Sidebar), all menus close after 100ms, unless the mouse moved into a Popover Menu.

### Viewport Boundary Detection

Menus automatically adjust their position if they would overflow the viewport:

- Shifts left if overflowing right edge.
- Shifts up if overflowing bottom edge.
- Maintains a 10px padding from viewport edges.

## Notes

- All menus render at `z-index: 999` to appear above other content.
- The system uses the `mousedown` event for click detection to ensure clicks are captured before other handlers.
- The menu automatically handles nested dropdown interactions through the `Dropdown` component.