const BGMVolume = (props: any) => {
    return (
        <input type="range" min={0} max={1} value={props.bgmVolume} onChange={props.setBGMVolume}></input>
    );
}