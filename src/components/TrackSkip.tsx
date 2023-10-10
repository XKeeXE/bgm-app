/**
 * // Will find the next track index in the current queue and overwrite the current url that is playing
 * @param props bgm, PlayTrack, bgmIndex
 * @returns the skip button
 */
const TrackSkip = (props: any) => {
    const { bgm, PlayTrack, bgmIndex } = props;
    
    return (
        <button className='button' onClick={() => {
            var nextTrack = bgm.findIndex((bgm: { played: boolean; }) => bgm.played === false); // find index
            console.log(bgm[nextTrack]);
            bgmIndex.current = bgm[nextTrack].index
            PlayTrack(bgmIndex.current);
            console.log("skipped");
       }}>Skip Track</button>
    );
}

export default TrackSkip;