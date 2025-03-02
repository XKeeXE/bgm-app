import { SvgIcon } from "@mui/material";
import { svg } from "./types/types";

const JapanFlag = () => {
    return (
        <SvgIcon>
            <svg xmlns="http://www.w3.org/2000/svg" id="flag-icons-jp" viewBox="0 0 512 512">
                <defs>
                    <clipPath id="jp-a">
                    <path fillOpacity=".7" d="M177.2 0h708.6v708.7H177.2z"/>
                    </clipPath>
                </defs>
                <g fillRule="evenodd" strokeWidth="1pt" clipPath="url(#jp-a)" transform="translate(-128)scale(.72249)">
                    <path fill="#fff" d="M0 0h1063v708.7H0z"/>
                    <circle cx="523.1" cy="344.1" r="194.9" fill="#bc002d" transform="translate(-59.7 -34.5)scale(1.1302)"/>
                </g>
            </svg>
        </SvgIcon>
    );
}

const PuertoRicoFlag = () => {
    return (
        <SvgIcon>
            <svg xmlns="http://www.w3.org/2000/svg" id="flag-icons-pr" viewBox="0 0 512 512">
                <defs>
                    <clipPath id="pr-a">
                    <path fillOpacity=".7" d="M51.6 0h708.7v708.7H51.6z"/>
                    </clipPath>
                </defs>
                <g fillRule="evenodd" clipPath="url(#pr-a)" transform="translate(-37.3)scale(.72249)">
                    <path fill="#ed0000" d="M0 0h1063v708.7H0z"/>
                    <path fill="#fff" d="M0 141.7h1063v141.8H0zm0 283.5h1063v141.7H0z"/>
                    <path fill="#0050f0" d="m0 0 610 353.9L0 707.3z"/>
                    <path fill="#fff" d="m268.2 450.5-65.7-49-65.3 49.5 24.3-80.5-65.3-49.7 80.7-.7 25-80.2 25.6 80 80.7.1-64.9 50.2z"/>
                </g>
            </svg>
        </SvgIcon>
    );
}

const UnitedStatesFlag = () => {
    return (
        <SvgIcon>
            <svg xmlns="http://www.w3.org/2000/svg" id="flag-icons-us" viewBox="0 0 512 512">
                <path fill="#bd3d44" d="M0 0h512v512H0"/>
                <path stroke="#fff" strokeWidth="40" d="M0 58h512M0 137h512M0 216h512M0 295h512M0 374h512M0 453h512"/>
                <path fill="#192f5d" d="M0 0h390v275H0z"/>
                <marker id="us-a" markerHeight="30" markerWidth="30">
                    <path fill="#fff" d="m15 0 9.3 28.6L0 11h30L5.7 28.6"/>
                </marker>
                <path fill="none" markerMid="url(#us-a)" d="m0 0 18 11h65 65 65 65 66L51 39h65 65 65 65L18 66h65 65 65 65 66L51 94h65 65 65 65L18 121h65 65 65 65 66L51 149h65 65 65 65L18 177h65 65 65 65 66L51 205h65 65 65 65L18 232h65 65 65 65 66z"/>
            </svg>
        </SvgIcon>
    );
}

const SVGAssets = (props: {key: svg}) => {
    const { key } = props;

    const GetIcon = (): JSX.Element => {
        switch (key) {
            case 'US': return <UnitedStatesFlag/>
            case 'PR': return <PuertoRicoFlag/>
            case 'JA': return <JapanFlag/>
        }
    }
    return (<GetIcon/>)
}

export default SVGAssets;