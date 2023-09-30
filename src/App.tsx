import './App.css'

import BGMList from './components/BGMList'
import fs from 'fs'
import BGMSaveQueue from './components/BGMSaveQueue'
import BGMLoadQueue from './components/BGMLoadQueue'
import { useState } from 'react'

let path = "E:/BGM/"
let trackPath: string;
let trackName: string;
let bgmIndex = -1;
let originaltrackIndex = 0;
let saveQueueTimer = 0;
const tracks = fs.readdirSync(path).map(item => item);
// const bgm = tracks.map(_track => {
//     return Object.assign(
//         {index: originaltrackIndex++},
//         {played: false}
//         )
//     })

function App() {
    // const [currentUrl, setCurrentUrl] = useState<string>(trackPath);
    // const [playing, setPlaying] = useState<boolean>(true);
    // const [selectedBGMIndex, setSelectedBGMIndex] = useState(-1);

    
    return (
        <>
            {/* <BGMLoadQueue bgm={bgm} message="Queue Loaded"/> // bgmload, save, pause, 
            <BGMSaveQueue bgm={bgm} message="Queue Saved"/> */} 
            <BGMList/>
        </>
    )
}

export default App;