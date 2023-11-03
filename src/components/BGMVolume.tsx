const BGMVolume = (props: any) => {
    const { savedSettings, setSavedSettings } = props;
    const handleVolumeChange = (e: { target: { value: string; }; }) => {
        setSavedSettings({...savedSettings, volume: parseFloat(e.target.value)}); 
    }
    return (
        <input className="absolute right-0 self-center" type="range" step="any" min={0} max={1} value={savedSettings.volume} onChange={handleVolumeChange}></input>
    );
}

export default BGMVolume;