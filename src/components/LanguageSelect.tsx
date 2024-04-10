import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import languages from '../assets/languages.json';

import PuertoRicoFlag from './svgIconsFlags/PuertoRicoFlag';
import UnitedStatesFlag from './svgIconsFlags/UnitedStatesFlag';
import JapanFlag from './svgIconsFlags/JapanFlag';
import { useEffect } from "react";

// @ts-ignore
const LanguageSelect = (props: any) => {
    
    const { language, setLanguage } = props;
    
    const CheckLanguage = () => {
        switch(language) {
            case 'es': return <PuertoRicoFlag/>;
            case 'en': return <UnitedStatesFlag/>;
            case 'ja': return <JapanFlag/>;
            default: return <UnitedStatesFlag/>;
        };
    }

    useEffect(() => {
        switch(language) {
            case 'es': return;
            case 'en': return;
            case 'ja': return;
            default: setLanguage('en');
        }
    }, [])

    // const LanugageSelector = (langCode, icon, langJson) => {
    //     // <DropdownItem 
    //     //         key="es"
    //     //         startContent={<PuertoRicoFlag/>}
    //     //         >
    //     //             {languages[language].spanish}
    //     // </DropdownItem>
    // }

    return (
        <>
        <Dropdown>
            <DropdownTrigger>
                <Button isIconOnly>
                    <CheckLanguage/>
                </Button>
                
            </DropdownTrigger>

            <DropdownMenu aria-label="language-menu" onAction={(key) => setLanguage(key)}>
                <DropdownItem 
                    key="es"
                    startContent={<PuertoRicoFlag/>}
                    >
                        
                        {/* {languages[language].spanish}  */}
                </DropdownItem>

                <DropdownItem 
                    key="en"
                    startContent={<UnitedStatesFlag/>}
                    >
                        {/* {languages[language].english} */}
                </DropdownItem>

                <DropdownItem 
                    key="ja"
                    startContent={<JapanFlag/>}
                    >
                        {/* {languages[language].japanese} */}
                </DropdownItem>

            </DropdownMenu>
        </Dropdown>
        
        {/* <select value={language} onChange={(e) => {setLanguage(e.target.value)}}>
            <option value="es"><PuertoRicoFlag/>{languages[language].spanish}</option>
            <option value="en"><UnitedStatesFlag/>{languages[language].english}</option>
            <option value="jp"><JapanFlag/>{languages[language].japanese}</option>
        </select> */}
        </>
    )
}

export default LanguageSelect;