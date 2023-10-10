import { useEffect } from "react";
import fs from 'fs';

const settingsFile = "Settings.txt";

const BGMLoadSettings = (props: any) => {
    const { volumeSettings, setVolumeSettings } = props;
    useEffect(() => {
        if (fs.existsSync(settingsFile)) { // if Settings.txt exists then read it
            const data = fs.readFileSync(settingsFile, 'utf8')
            setVolumeSettings(JSON.parse(data));
            return;
        }
        let settings = JSON.stringify(volumeSettings)
        fs.writeFileSync(settingsFile, settings, 'utf8') // else create it and set volumeSettings with its default settings
    }, [])
    return (
        <></>
    );
}

export default BGMLoadSettings;