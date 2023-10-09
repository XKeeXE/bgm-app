import ReactPlayer from "react-player/lazy";

const TrackSeek = (props: any) => {
  const { playerRef, bgmPlayer, setBGMPlayer } = props;

  const handleSeekMouseUp = (e: any) => {
    console.log("up");
    console.log(bgmPlayer);
    setBGMPlayer({...bgmPlayer, seeking: false});
    playerRef.current?.seekTo(parseFloat(e.target.value));
    
  };

  const handleSeekChange = (e: any) => {
    console.log("change");
    console.log(bgmPlayer);
    setBGMPlayer({...bgmPlayer, played: parseFloat(e.target.value)});
  };
  
  const handleSeekMouseDown = (e: any) => {
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
      <ReactPlayer ref={playerRef}/>
    </>
  );
};

export default TrackSeek;