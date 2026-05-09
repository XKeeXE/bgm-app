import * as Icons from '../../toolbox/utils/Icons';
import { UI } from '../../toolbox/utils/types';
import { useStore } from '../../toolbox/store';

export const windowConfig: UI[] = [
    { key: "Minimize",  tooltip: "", icon: <Icons.Minimize/>,  onClick: () => window.api.minimize() },
    { key: "Fullscreen",tooltip: "", icon: <Icons.Fullscreen/>, onClick: () => window.api.maximize() },
    { key: "Close",     tooltip: "", icon: <Icons.Close/>,      onClick: () => window.api.quit() },
];

export const bgmConfig: UI[] = [
    { key: "Save", tooltip: "Save", icon: <Icons.SaveQueue/>, onClick: () => useStore.getState().player.syncQueue('save') },
    { key: "Load", tooltip: "Load", icon: <Icons.LoadQueue/>, onClick: () => useStore.getState().player.syncQueue('load') },
];
