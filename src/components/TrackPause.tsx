function TrackPause(props: any) {
    const { playing, setPlaying } = props;

    return (
        <button className='button' onClick={() => {
            setPlaying(!playing); // if paused play, if playing pause
            console.log(playing); // Paused: true | false
        }}>Pause</button>
    );
}

export default TrackPause;