import { Button, Tooltip } from "@nextui-org/react";
import {Slider} from "@nextui-org/slider"
import { VolumeDown, VolumeMute, VolumeOff, VolumeUp } from "@mui/icons-material";
import { useEffect, useState } from "react";


const BGMVolume = (props: any) => {
    const { muteBGM, setMuteBGM, showVolume, setShowVolume, savedSettings, setSavedSettings } = props;
    const [volumeType, setVolumeType] = useState<number>();
    const handleVolumeChange = (value: any) => {
        setSavedSettings({...savedSettings, volume: parseFloat(value.toString())}); 
    }
    useEffect(() => {
        if (savedSettings.volume <= 0.1) {
            setVolumeType(0);
        } else if (savedSettings.volume > 0.1 && savedSettings.volume <= 0.5) {
            setVolumeType(1);
        } else {
            setVolumeType(2);
        }
    }, [savedSettings.volume])

    const BGMVolumeSwitch = () => {
        switch(volumeType){
            case 0: return <VolumeMute/>
            case 1: return <VolumeDown/>
            case 2: return <VolumeUp/>
        }
    }

    return (
        <>
        <div className="absolute right-0 self-center w-[20%] flex align-middle justify-center max-w-[200px]" onMouseEnter={() => { // inspired by Youtube
            setShowVolume(true); // set show volume as true to show input
        }}>
            <Tooltip content={savedSettings.volume.toFixed(2)}>
                <Button className="" variant="light" isIconOnly aria-label="volume button" onClick={() => {
                    setMuteBGM(!muteBGM); // mute the bgm
                }}>
                    {muteBGM ? <VolumeOff/> : <BGMVolumeSwitch/>}
                </Button>
            </Tooltip>
            <Slider 
                className={"self-center translate-x-[100%] " + (showVolume ? " animate-[show-volume_0.1s_ease-in-out_0.08s_1_both]" : " animate-[hide-volume_0.1s_ease-in-out_1_both] ")}
                aria-label="volume slider"
                hideThumb
                color="foreground"
                size="md"
                step={0.01} 
                maxValue={1}
                minValue={0}
                value={savedSettings.volume}
                onChange={handleVolumeChange}>
            </Slider>
        </div>
        </>
    );
}

export default BGMVolume;