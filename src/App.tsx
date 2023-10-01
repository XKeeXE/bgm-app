import './App.css'

import BGMList from './components/BGMList'
import fs from 'fs'
import BGMSaveQueue from './components/BGMSaveQueue'
import BGMLoadQueue from './components/BGMLoadQueue'
import TrackThumbnail from './components/TrackThumbnail';
import { useState } from 'react'
import TrackPause from './components/TrackPause'

// let path = "E:/BGM/"
// let trackPath: string;
// let trackName: string;
// let bgmIndex = -1;
// let originaltrackIndex = 0;
// let saveQueueTimer = 0;
// const tracks = fs.readdirSync(path).map(item => item);
// const bgm = tracks.map(_track => {
//     return Object.assign(
//         {index: originaltrackIndex++},
//         {played: false}
//         )
//     })
// const [bgm, setBGM] = useState(tracks.map(_tracks => {
//     return Object.assign(
//         {index: originaltrackIndex++},
//         {played: false}
//         )
// }))

function App() {
    // const [currentUrl, setCurrentUrl] = useState<string>(trackPath);
    // const [selectedBGMIndex, setSelectedBGMIndex] = useState(-1);
    
    
    return (
        <>
            <TrackPause/>
            <BGMList/>
            {/* <TrackThumbnail url={currentUrl}/> */}
            {/* <BGMLoadQueue bgm={bgm} message="Queue Loaded"/> // bgmload, save, pause, 
            <BGMSaveQueue bgm={bgm} message="Queue Saved"/> */} 
        </>
    )
}

export default App;