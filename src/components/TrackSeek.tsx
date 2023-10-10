const TrackSeek = (props: any) => {
  const { bgmPlayerRef, bgmPlayer, setBGMPlayer } = props;

  const handleSeekMouseUp = (e: any) => {
    setBGMPlayer({...bgmPlayer, seeking: false});
    bgmPlayerRef.current?.seekTo(parseFloat(e.target.value));
  };

  const handleSeekChange = (e: any) => {
    setBGMPlayer({...bgmPlayer, played: parseFloat(e.target.value)});
  };
  
  const handleSeekMouseDown = (_e: any) => {
    setBGMPlayer({...bgmPlayer, seeking: true});
  };
  
  return (
    <>
      <input className="track-seek" 
      type="range" 
      min={0} 
      max={0.999999} 
      step="any" 
      value={bgmPlayer.played} 
      onMouseUp={handleSeekMouseUp}
      onChange={handleSeekChange}
      onMouseDown={handleSeekMouseDown}>
      </input>
    </>
  );
};

export default TrackSeek;