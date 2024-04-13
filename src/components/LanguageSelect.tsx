import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import PuertoRicoFlag from './svgIconsFlags/PuertoRicoFlag';
import UnitedStatesFlag from './svgIconsFlags/UnitedStatesFlag';
import JapanFlag from './svgIconsFlags/JapanFlag';
import { useEffect } from "react";

const LanguageSelect = (props: any) => {
    const { language, setLanguage, getTranslatedText } = props;
    
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

    return (
        <>
        <Dropdown>
            <DropdownTrigger>
                <Button variant="light" size="sm" isIconOnly aria-label="language" disableAnimation>
                    <CheckLanguage/>
                </Button>
            </DropdownTrigger>

            <DropdownMenu aria-label="language-menu" onAction={(key) => setLanguage(key)}>
                <DropdownItem key="es" startContent={<PuertoRicoFlag/>}>
                    {getTranslatedText('spanish')}
                </DropdownItem>

                <DropdownItem key="en" startContent={<UnitedStatesFlag/>}>
                    {getTranslatedText('english')}
                </DropdownItem>

                <DropdownItem key="ja" startContent={<JapanFlag/>}>
                    {getTranslatedText('japanese')}
                </DropdownItem>

            </DropdownMenu>
        </Dropdown>
        </>
    )
}

export default LanguageSelect;