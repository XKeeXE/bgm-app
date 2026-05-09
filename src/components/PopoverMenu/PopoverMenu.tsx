"use client";

import { create } from "zustand";
import type { PopoverMenuConfig } from "./types";
import Menu from "./components/Menu";
import { useCallback } from "react";

// 1. Define the Context type for DOM elements
export interface PopoverMenuContext {
  trigger?: HTMLElement | null;
  container?: HTMLElement | null;
}

export interface MenuInstance {
  id: string;
  position: { x: number; y: number };
  config: PopoverMenuConfig;
  context: PopoverMenuContext; // 2. Add context to the instance
}

interface PopoverMenuStore {
  menus: MenuInstance[];
  // 3. Update openMenu signature to accept context
  openMenu: (
    x: number,
    y: number,
    config: PopoverMenuConfig,
    context?: PopoverMenuContext
  ) => void;
  closeMenu: (id?: string) => void;
  closeAllMenus: () => void;
}

const usePopoverMenuStore = create<PopoverMenuStore>((set) => ({
  menus: [],

  openMenu: (x, y, config, context = {}) =>
    set((state) => {
      // Check if menu with same ID already exists
      const existingIndex = state.menus.findIndex(
        (m) => m.config.id === config.id
      );

      const newMenu: MenuInstance = {
        id: config.id,
        position: { x, y },
        config,
        context, // Store the DOM elements
      };

      if (existingIndex !== -1) {
        // Replace existing menu with same ID
        const newMenus = [...state.menus];
        newMenus[existingIndex] = newMenu;
        return { menus: newMenus };
      }

      // Add new menu
      return {
        menus: [...state.menus, newMenu],
      };
    }),

  closeMenu: (id) =>
    set((state) => ({
      menus: id
        ? state.menus.filter((menu) => menu.config.id !== id)
        : state.menus.slice(0, -1),
    })),

  closeAllMenus: () => set({ menus: [] }),
}));

// Action-only hook — reads from getState() so it never subscribes to the store
// and never causes a re-render in the calling component.
export const usePopoverMenu = () => {
  const showPopoverMenu = useCallback(
    (...args: Parameters<PopoverMenuStore["openMenu"]>) =>
      usePopoverMenuStore.getState().openMenu(...args),
    []
  );
  const closePopoverMenu = useCallback(
    (...args: Parameters<PopoverMenuStore["closeMenu"]>) =>
      usePopoverMenuStore.getState().closeMenu(...args),
    []
  );
  const closeAllPopoverMenus = useCallback(
    () => usePopoverMenuStore.getState().closeAllMenus(),
    []
  );

  return { showPopoverMenu, closePopoverMenu, closeAllPopoverMenus };
};

export default function PopoverMenuRenderer() {
  const menus = usePopoverMenuStore((state) => state.menus);

  return (
    <>
      {menus.map((menu) => (
        <Menu key={menu.id} menu={menu} />
      ))}
    </>
  );
}