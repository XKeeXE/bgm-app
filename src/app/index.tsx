import './App.css'
import './index.css'
import ReactDOM from 'react-dom/client'
import { useEffect, useRef } from "react";
import UISettings from '../components/UISettings';
import BGMTableList from '../components/BGMTableList';
import UINavbar from '../components/UINavbar';
import BGMQueue from '../components/BGMQueue';
import UIUtilities from '../components/UIUtilities';
import TrackProgress from '../components/TrackProgress';
import { useStore } from '../toolbox/store';
import { Setting } from '../toolbox/utils/types';
import PopoverMenuRenderer from '../components/PopoverMenu/PopoverMenu';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

function App() {
    const currentTrack = useStore((store) => store.player.currentTrack);
    const saveQueueTimer = useRef(0);

    useKeyboardShortcuts();

    useEffect(() => {
        window.api.onLoaded((settings: Setting) => {
            useStore.getState().app.setDarkMode(settings.darkMode);
            useStore.getState().app.setMaxSaveTimer(settings.maxSaveTimer);
            useStore.getState().player.setVolume(settings.volume);
            window.api.loadReady();
        });

        window.api.loadTracks().then(bgmData => {
            useStore.getState().player.loadTracks(bgmData);
        });

        window.api.onTrackStarted((duration) => {
            useStore.getState().player.setDuration(duration);
            if (!useStore.getState().player.loop) {
                if (saveQueueTimer.current >= useStore.getState().app.maxSaveTimer) {
                    saveQueueTimer.current = 0;
                    useStore.getState().player.syncQueue('save');
                } else {
                    saveQueueTimer.current++;
                }
            }
        });

        window.api.onTrackEnded(() => {
            const loop = useStore.getState().player.loop;
            if (!loop) {
                useStore.getState().player.playNextInQueue();
            } else {
                window.api.loopPlayer(loop);
            }
        });

        window.api.onError(() => {
            window.general.log(`Error on track: ${useStore.getState().player.currentTrack.url}`);
            useStore.getState().player.playNextInQueue();
        });
    }, []);

    useEffect(() => {
        if (currentTrack.url) {
            window.api.playTrack(currentTrack.url);
        }
    }, [currentTrack]);

    return (
        <div className='main-background h-screen flex flex-col'>
            <div className='flex flex-row flex-grow '>
                <UISettings />
                <div className='w-full overflow-hidden ' >
                        <div className='current-track titlebar h-[30px] select-none' draggable={false}>
                            <span className='pl-2 font-renogare line-clamp-1'>{currentTrack.title ? currentTrack.title : 'BGM App (Vite + React + TS)'}</span>
                        </div>
                        <div className="flex flex-row h-[calc(100%-30px)] ">
                            <div className='flex flex-col max-w-[20%] min-w-[20%] h-full '>
                                <BGMQueue />
                            </div>
                            <div className='main w-full flex flex-col'>
                                <div className='w-full h-full '>
                                    <BGMTableList />
                                </div>
                                <div className='flex w-full items-end '>
                                    <TrackProgress />
                                </div>
                            </div>
                        </div>
                </div>
                <UIUtilities />
            </div>
            <UINavbar />
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <>
        <App />
        <PopoverMenuRenderer />
    </>
)

postMessage({ payload: 'removeLoading' }, '*')