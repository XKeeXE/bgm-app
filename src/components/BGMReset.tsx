import { Button, Tooltip } from "@nextui-org/react";
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const BGMReset = (props: any) => {
    const { bgm, playedTracks } = props;
    return (
        <Tooltip content="Reset">
            <Button variant="light" size="lg" isIconOnly aria-label="reset" onClick={() => {
                for (let index = 0; index <= bgm.current.length; index++) {
                    bgm.current[index].played = false;
                }
                playedTracks.current = [];
            }}><RestartAltIcon/>
            </Button>
        </Tooltip>
    )
}

export default BGMReset;