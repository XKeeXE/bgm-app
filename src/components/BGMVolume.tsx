const BGMVolume = (props: any) => {
    const { volumeSettings, setVolumeSettings } = props;
    const handleVolumeChange = (e: { target: { value: string; }; }) => {
        setVolumeSettings({...volumeSettings, volume: parseFloat(e.target.value)}); 
    }
    return (
        <input className="bgm-volume" type="range" step="any" min={0} max={1} value={volumeSettings.volume} onChange={handleVolumeChange}></input>
    );
}

export default BGMVolume;