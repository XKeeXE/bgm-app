import { Progress, Slider } from "@nextui-org/react";
import { useRef, useState } from "react";

const TrackSeek = (props: any) => {
  const { bgmPlayerRef, bgmPlayer, setBGMPlayer, trackCurrentTime, trackDuration } = props;
  const [showSlider, setShowSlider] = useState(false);

  const handleSeekChange = (value: any) => {
    setBGMPlayer({...bgmPlayer, seeking: false});
    bgmPlayerRef.current?.seekTo(parseFloat(value));
    
  };
  
  return (
    <>
    <div className="absolute flex w-[400px] h-[25%] bottom-0 self-center bg-white-500 align-middle justify-items-center" onMouseEnter={() => {
      // setShowSlider(false);
    }} onMouseLeave={() => {
      // setShowSlider(false);
    }}> 
    {/* <p className="left-0" >{trackCurrentTime}</p> */}
    {showSlider ? 
    <Slider
      size="md"
      step={0.01}
      value={bgmPlayer.played} 
      hideThumb
      maxValue={0.999999} 
      className="max-w-md absolute bottom-0"
      aria-label="seek slider"
      onChange={handleSeekChange}/> 
      : 
      <Slider
      size="sm"
      step={0.01}
      value={bgmPlayer.played} 
      hideThumb
      maxValue={0.999999} 
      className="max-w-md absolute bottom-1.5 min-w-[90%]"
      aria-label="seek progress"/> }
      {/* <Progress 
      size="sm" 
      value={bgmPlayer.played} 
      maxValue={0.999999} 
      className="max-w-md absolute bottom-3.5"
      aria-label="seek progress"/> */}
      {/* <p className="right-0" >{trackDuration}</p> */}
    </div>
    </>
  );
};

export default TrackSeek;