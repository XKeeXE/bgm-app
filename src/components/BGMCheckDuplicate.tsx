import { Button, Tooltip } from "@nextui-org/react";
import SearchIcon from '@mui/icons-material/Search';
import { useRef } from "react";

const BGMCheckDuplicate = (props: any) => {
    const { tracks, CheckTrackType } = props;
    const result = useRef<any>();
    return (
        <Tooltip content="Check">
            <Button variant="light" size="lg" isIconOnly aria-label="check duplicate" onClick={() => {
                result.current = [];
                let trackName: string;
                for (let index = 0; index < tracks.current.length; index++) {
                    trackName = CheckTrackType(tracks.current[index]);
                    if (trackName.includes('-1', trackName.length-2) == true) {
                        result.current.push(trackName);
                        break;
                    }
                }
                console.log(result.current);
            }}><SearchIcon/>
            </Button>
        </Tooltip>
    )
}

export default BGMCheckDuplicate;