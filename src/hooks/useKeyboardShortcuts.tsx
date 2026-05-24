import { useHotkeys } from "react-hotkeys-hook";
import { useStore } from "../toolbox/store";
import { addVolume, removeVolume } from "../toolbox/utils/volume";

export function useKeyboardShortcuts() {
    useHotkeys('space', () => useStore.getState().player.setPlaying(), { preventDefault: true });
    useHotkeys('left', () => useStore.getState().player.setVolume(removeVolume(useStore.getState().player.volume)), { preventDefault: true });
    useHotkeys('right', () => useStore.getState().player.setVolume(addVolume(useStore.getState().player.volume)), { preventDefault: true });
    useHotkeys('escape', () => useStore.getState().app.clearSelectedIds(), { preventDefault: true });
}
