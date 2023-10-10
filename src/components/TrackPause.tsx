/**
 * Will receive playing and setPlaying states to change the Reactplayer playing state
 * @param props playing, setPlaying
 * @returns the Pause button
 */
const TrackPause = (props: any) => {
    const { playing, setPlaying } = props;

    return (
        <button className='button' onClick={() => {
            setPlaying(!playing); // if paused play, if playing pause
            console.log(playing); // Paused: true | false
        }}>Pause</button>
    );
}

export default TrackPause;