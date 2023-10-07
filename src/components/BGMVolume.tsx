import { useState } from "react";

const BGMVolume = (props: any) => {
    const { bgmVolume, setBGMVolume } = props;
    const [volumeSlider, setVolumeSlider] = useState(bgmVolume * 100)
    const handleVolumeChange = (e: { target: { value: string; }; }) => {
        setVolumeSlider(parseFloat(e.target.value))
        setBGMVolume(volumeSlider/100)
        console.log(bgmVolume);
    }
    // console.log(volumeSlider);
    // console.log(bgmVolume);

    // Algo weird con este range input que como esta puesto como setVolumeSlider y setBGMVolume el onChange event esta como un poco delayed(Question mark??)
    // hace que en vez de que el range sea:     0 volume -> |---------O---------| <- volume 1
    //                                  es:   0.1 volume -> |---------O---------| <- volume 0.9
    // pero hay algo weird que cuando esta en el penultimo hace el intended behaviour:
    //                                          0 volume -> |-O-----------------| <- volume 1
    //                                          0 volume -> |-----------------O-| <- volume 1

    // esta como que delayed, wtf???
    return (
        <input type="range" min={0} max={100} value={volumeSlider} onChange={handleVolumeChange}></input>
    );
}

export default BGMVolume;