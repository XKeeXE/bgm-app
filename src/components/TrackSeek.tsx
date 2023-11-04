import { Progress, Slider } from "@nextui-org/react";

const TrackSeek = (props: any) => {
  const { bgmPlayerRef, bgmPlayer, setBGMPlayer } = props;

  const handleSeekChange = (value: any) => {
    setBGMPlayer({...bgmPlayer, seeking: false});
    bgmPlayerRef.current?.seekTo(parseFloat(value));
    
  };
  
  return (
    <>
      <Slider
        size="sm"
        step={0.01}
        value={bgmPlayer.played} 
        hideThumb
        maxValue={0.999999} 
        className="max-w-md absolute bottom-1.5"
        aria-label="seek"
        onChange={handleSeekChange}/>
        
      {/* <Progress 
      size="sm" 
      value={bgmPlayer.played} 
      maxValue={0.999999} 
      className="max-w-md absolute bottom-3.5"
      aria-label="seek"/> */}
    </>
  );
};

export default TrackSeek;