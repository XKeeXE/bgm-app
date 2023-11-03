import { Button, Progress } from "@nextui-org/react";


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
      <Progress 
      size="sm" 
      value={bgmPlayer.played} 
      maxValue={0.999999} 
      className="max-w-md absolute bottom-3.5"
      aria-label="seek"/>
      </>
  );
};

export default TrackSeek;