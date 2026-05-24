import * as Icons from '../toolbox/utils/Icons';
import { UI } from '../toolbox/utils/types';
import { useStore } from '../toolbox/store';

export const trackConfig = (playing: boolean, loop: boolean, playedQueueLength: number, initialized: boolean): UI[] => {
    const hasPrev = playedQueueLength >= 2;
    return [
    {
        key: 'Shuffle',
        tooltip: '',
        icon: <Icons.Shuffle/>,
        onClick: () => useStore.getState().player.shuffleQueue(),
    },
    {
        key: 'Back',
        tooltip: '',
        icon: hasPrev ? <Icons.Back/> : initialized ? <Icons.Close htmlColor="gray"/> : <Icons.Back htmlColor="gray"/>,
        onClick: () => hasPrev
            ? useStore.getState().player.playPrevious()
            : useStore.getState().player.resetPlayer(),
        disabled: !initialized,
    },
    {
        key: 'Play/Pause',
        tooltip: '',
        icon: playing ? <Icons.Pause fontSize="large"/> : <Icons.Play fontSize="large"/>,
        onClick: () => useStore.getState().player.setPlaying(),
    },
    {
        key: 'Skip',
        tooltip: '',
        icon: <Icons.Skip/>,
        onClick: () => useStore.getState().player.playNextInQueue(),
    },
    {
        key: 'Loop',
        tooltip: '',
        icon: loop ? <Icons.Loop/> : <Icons.Loop htmlColor="gray"/>,
        onClick: () => useStore.getState().player.setLoop(),
    },
];};

export const playerConfig = (mute: boolean): UI[] => {
    return [
    {
        key: 'Volume',
        tooltip: '',
        icon: mute ? <Icons.VolumeMute/> : <Icons.VolumeUp/>,
        onClick: () => useStore.getState().player.setMute(),
    },
];};
