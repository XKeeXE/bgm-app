import ReactPlayer from "react-player/lazy";

const TrackSeek = ({
    playerRef,
  }) => {
      console.log(playerRef);
      const handleSeekMouseUp = (e: any) => {
        playerRef.current?.seekTo(parseFloat(e.target.value));
       };
      return (
        <>
            <input className="track-seek" type="range" min={0} max={0.999999} step="any" value={playerRef} onChange={handleSeekMouseUp}></input>
            <ReactPlayer ref={playerRef}/>
        </>
    );
  };

export default TrackSeek;