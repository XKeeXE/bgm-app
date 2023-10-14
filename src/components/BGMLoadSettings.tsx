import { useEffect } from "react";
import fs from 'fs';

const BGMLoadSettings = (props: any) => {
    const { settingsFile, savedSettings, setSavedSettings } = props;
    useEffect(() => { // Run once on startup
        if (fs.existsSync(settingsFile)) { // if Settings.txt exists then read it
            const data = fs.readFileSync(settingsFile, 'utf8')
            setSavedSettings(JSON.parse(data));
            return;
        }
        let settings = JSON.stringify(savedSettings)
        fs.writeFileSync(settingsFile, settings, 'utf8') // else create it and set savedSettings with its default settings
    }, [])
    return (
        <></>
    );
}

export default BGMLoadSettings;