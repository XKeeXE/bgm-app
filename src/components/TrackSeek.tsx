import { Slider } from "@nextui-org/react";
import { useState } from "react";

const TrackSeek = (props: any) => {
  const { bgmPlayerRef, bgmPlayer, setBGMPlayer, trackCurrentTime, trackDuration } = props;
  const [showSlider, setShowSlider] = useState(false);

  const handleSeekChange = (value: any) => {
    setBGMPlayer({...bgmPlayer, seeking: false});
    bgmPlayerRef.current?.seekTo(parseFloat(value));
  };
  
  return (
    <>
    <div className="absolute flex w-[50%] h-[25%] min-w-[300px] max-w-[500px] bottom-1 self-center align-middle items-center justify-center" onMouseEnter={() => {
      setShowSlider(true);
    }} onMouseLeave={() => {
      setShowSlider(false);
    }}> 
      <p className="pr-1 text-xs select-none">{trackCurrentTime}</p>
      {showSlider ? 
      <Slider
        size="md"
        color="foreground"
        step={0.01}
        value={bgmPlayer.played} 
        hideThumb
        maxValue={0.999999} 
        className="max-w-md flex-none"
        aria-label="seek slider"
        onChange={handleSeekChange}/> 
        : 
        <Slider
        size="sm"
        color="foreground"
        step={0.01}
        value={bgmPlayer.played} 
        hideThumb
        maxValue={0.999999} 
        className="max-w-md flex-none bottom"
        aria-label="seek progress"/> }
        <p className="pl-1 text-xs select-none">{trackDuration}</p>
    </div>
    </>
  );
};

export default TrackSeek;