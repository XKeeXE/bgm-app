

const TrackSkip = (props: any) => {
    
    return (
       <button onClick={() => {
            // if (bgmIndex == -1) {
            //     console.log("test");
            // }
            var currentTrack = props.bgm.findIndex((bgm: { played: boolean; }) => bgm.played === false);
            props.bgmIndex = props.bgm[currentTrack].index
            // PlayTrack(bgmIndex);
            console.log("skipped");
       }}>Skip Track</button>
    );
}

export default TrackSkip;