function TrackPause(props: any) {
    return (
        <button onClick={() => {props.setPlaying(!props.playing)}}></button>
    );
}