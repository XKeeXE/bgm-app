import * as Icons from '../../toolbox/utils/Icons';
import { UI } from '../../toolbox/utils/types';
import { useStore } from '../../toolbox/store';

export const settingConfig: UI[] = [
    { key: 'Darkmode', tooltip: 'Change Theme',  icon: <Icons.Darkmode fontSize='large'/>,    onClick: () => window.api.darkmode() },
    { key: 'Local',    tooltip: 'Local Tracks',  icon: <Icons.InsertFile fontSize='large'/>,  onClick: () => window.api.addLocalTracks(useStore.getState().player.bgm.size) },
    { key: 'Home',     tooltip: 'Directory',     icon: <Icons.Directory fontSize='large'/>,   onClick: () => window.api.selectHome() },
];
