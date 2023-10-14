import fs from 'fs';

const BGMSaveSettings = (props: any) => {
    const { settingsFile, savedSettings } = props;

    const SaveSettings = () => {
        let settings = JSON.stringify(savedSettings)
        fs.writeFileSync(settingsFile, settings, 'utf8')
    }

    window.onbeforeunload = (_e) => { // Run once when app closes
        SaveSettings();
    };
    
    return (
        <></>
    );
}

export default BGMSaveSettings;