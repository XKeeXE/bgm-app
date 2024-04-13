import { Card, CardBody, Divider } from "@nextui-org/react";
import BGMShuffle from "./BGMShuffle";
import TrackPrevious from "./TrackPrevious";
import TrackPause from "./TrackPause";
import TrackSkip from "./TrackSkip";
import TrackLoop from "./TrackLoop";
import BGMLoadQueue from "./BGMLoadQueue";
import BGMSaveQueue from "./BGMSaveQueue";
import BGMCheckDuplicate from "./BGMCheckDuplicate";
import BGMVolume from "./BGMVolume";
import TrackPlay from "./TrackPlay";
import { useRef, useState } from "react";

import fs from 'fs'
import UISettings from "./UISettings";

const queueFile = "BGMQUEUE.txt";

const UINavbar = (props: any) => {
    const { bgm, tracks, savedSettings, setSavedSettings, bgmIndex, currentUrl, virtuosoRef, listRef, 
        language, setLanguage, playedTracks, currentSelectedTrack, setSelectedTrack, forceUpdate, setForceUpdate, 
        ScrollToIndex, CheckTrackType, PlayNextInQueue, PlayTrack } = props;
    
    const saveQueueTimer = useRef<number>(0); // auto save timer

    const [playing, setPlaying] = useState<boolean>(true); // to pause and resume ReactPlayer
    const [muteBGM, setMuteBGM] = useState<boolean>(false); // to mute and unmute ReactPlayer
    const [showVolume, setShowVolume] = useState<boolean>(false); // to show and hide volume
    const [loopTrack, setLoopTrack] = useState<boolean>(false) // to loop current track
    
    /**
     * Will convert data from the json into the current bgm queue
    */
    function GetBGMJson() {
        const data = fs.readFileSync(queueFile, 'utf8') // read the file and put it in data
        let jsonBGM = JSON.parse(data); // parse the data into the json bgm variable
        // for every track in the json change the current bgm into the one in the json
        for (let index = 0; index < bgm.current.length; index++) {
            bgm.current[index] = jsonBGM[index];
        }
        playedTracks.current = [];
        bgm.current.filter(CheckPlayedTracks);
    }

    
    /**
     * Will set stringify current bgm into the json
    */
    function SetBGMJson() {
        let jsonBGM = JSON.stringify(bgm.current);
        fs.writeFileSync(queueFile, jsonBGM, 'utf8');
    }

    /**
     * Inserts the track that was played into an object that consists of only played tracks
     * @param track the track object from the bgm object
     */
    function CheckPlayedTracks(track: any) {
        if (track.played == true) {
            playedTracks.current.push(track.index);
        }
    }

    return (
        <>
        <Card className="fixed bottom-0 w-[100vw]" shadow="none" style={{
            background: 'linear-gradient(to left, #1b1b1b, #1b1919, #1b1b1b)',
            zIndex: 10
        }}>
            <CardBody className="relative">
                <div className="flex place-content-center justify-center align-middle self-center w-full" onMouseLeave={() => {setShowVolume(false)}}>
                    <div className='relative bottom-2 align-middle flex justify-center items-center w-[30%] max-w-[300px]'>
                        <div className='absolute left-0'>
                            <BGMShuffle bgm={bgm} language={language} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate}/>
                            <Divider orientation="vertical" />
                        </div>
                        <TrackPrevious playedTracks={playedTracks} bgm={bgm} bgmIndex={bgmIndex} language={language} PlayTrack={PlayTrack}/>
                        <TrackPause listRef={listRef} currentSelectedTrack={currentSelectedTrack} playing={playing} language={language} ScrollToIndex={ScrollToIndex} 
                        setPlaying={setPlaying} setSelectedTrack={setSelectedTrack}/>
                        <TrackSkip bgm={bgm} PlayNextInQueue={PlayNextInQueue}/>
                        <div className='absolute right-0'>
                            <Divider orientation="vertical" />
                            <TrackLoop loopTrack={loopTrack} language={language} setLoopTrack={setLoopTrack}/>
                        </div>
                    </div>
                    <div className="absolute left-6 self-center flex">
                        {/* <UISettings language={language} setLanguage={setLanguage}/> */}
                        <BGMLoadQueue SetBGMJson={SetBGMJson} GetBGMJson={GetBGMJson} language={language} PlayNextInQueue={PlayNextInQueue}/>
                        <BGMSaveQueue bgm={bgm} saveQueueTimer={saveQueueTimer} language={language}/>
                        <BGMCheckDuplicate tracks={tracks} language={language} CheckTrackType={CheckTrackType}/>
                    </div>
                    <BGMVolume muteBGM={muteBGM} setMuteBGM={setMuteBGM} showVolume={showVolume} setShowVolume={setShowVolume} savedSettings={savedSettings} setSavedSettings={setSavedSettings}/>
                    <TrackPlay bgm={bgm} bgmIndex={bgmIndex} currentSelectedTrack={currentSelectedTrack} saveQueueTimer={saveQueueTimer} playing={playing} currentUrl={currentUrl} 
                    muteBGM={muteBGM} loopTrack={loopTrack} savedSettings={savedSettings} ScrollToIndex={ScrollToIndex} SetBGMJson={SetBGMJson} PlayNextInQueue={PlayNextInQueue}/>
                </div>
            </CardBody>
        </Card>
        </>
    )
}

export default UINavbar;