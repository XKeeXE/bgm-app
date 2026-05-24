import * as Icons from '../toolbox/utils/Icons';
import { Track } from '../interfaces/store/player';
import { useStore } from '../toolbox/store';
import { MenuItem } from '../components/general/Menu';

export const singleTrackItems = (selectedContext: React.MutableRefObject<Track>): MenuItem[] => [
    {
        type: 'button',
        id: 'Queue',
        label: 'Queue',
        icon: <Icons.Queue/>,
        onClick: () => useStore.getState().player.queueTrack(selectedContext.current),
    },
    {
        type: 'button',
        id: 'Stack',
        label: 'Stack',
        icon: <Icons.Stack/>,
        onClick: () => useStore.getState().player.stackTrack(selectedContext.current),
    },
    {
        type: 'button',
        id: 'Play',
        label: 'Play',
        icon: <Icons.PlayTrack/>,
        onClick: () => {
            useStore.getState().player.removeFromQueue(selectedContext.current);
            useStore.getState().player.playTrack(selectedContext.current);
        },
    },
    { type: 'separator' },
    {
        type: 'button',
        id: 'Clipboard',
        label: 'Clipboard',
        icon: <Icons.Clipboard/>,
        onClick: () => {
            const title = selectedContext.current.title;
            window.general.log(`Copied \n${title}`);
            navigator.clipboard.writeText(title);
        },
    },
    {
        type: 'button',
        id: 'Info',
        label: 'Info',
        icon: <Icons.Info/>,
        onClick: () => window.general.log(`${JSON.stringify(selectedContext.current)}`),
    },
    {
        type: 'button',
        id: 'Remove',
        label: 'Remove',
        icon: <Icons.Remove/>,
        onClick: () => {
            // First remove the track, then reorganize the tracks, then reload the queue
            // bgm.delete(selectedContext.current.id);
        },
    },
];

export const multiTrackItems = (selection: Track[]): MenuItem[] => [
    {
        type: 'button',
        id: 'QueueAll',
        label: `Queue All (${selection.length})`,
        icon: <Icons.Queue/>,
        onClick: () => useStore.getState().player.queueTracks(selection),
    },
    {
        type: 'button',
        id: 'StackAll',
        label: `Stack All (${selection.length})`,
        icon: <Icons.Stack/>,
        onClick: () => useStore.getState().player.stackTracks(selection),
    },
    {
        type: 'button',
        id: 'PlayAll',
        label: `Play (${selection.length})`,
        icon: <Icons.PlayTrack/>,
        onClick: () => {
            const [first, ...rest] = selection;
            useStore.getState().player.removeFromQueue(first);
            useStore.getState().player.playTrack(first);
            if (rest.length > 0) useStore.getState().player.stackTracks(rest);
        },
    },
    { type: 'separator' },
    {
        type: 'button',
        id: 'ClipboardAll',
        label: 'Clipboard',
        icon: <Icons.Clipboard/>,
        onClick: () => {
            const titles = selection.map((t) => t.title).join('\n');
            window.general.log(`Copied ${selection.length} titles`);
            navigator.clipboard.writeText(titles);
        },
    },
];
