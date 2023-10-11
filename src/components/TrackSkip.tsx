/**
 * // Will find the next track index in the current queue and overwrite the current url that is playing
 * @param props bgm, PlayTrack, bgmIndex
 * @returns the skip button
 */
const TrackSkip = (props: any) => {
    const { bgm, PlayTrack, bgmIndex } = props;
    
    return (
        <button className='button' onClick={() => {
            var nextTrack = bgm.current.findIndex((bgm: { played: boolean; }) => bgm.played === false); // find index
            console.log(bgm.current[nextTrack]);
            bgm.current[nextTrack].played = true; // just in case the follwing track is not playable
            bgmIndex.current = bgm.current[nextTrack].index
            PlayTrack(bgmIndex.current);
            console.log("skipped");
       }}>Skip Track</button>
    );
}

export default TrackSkip;