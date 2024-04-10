import { Button, Tooltip } from "@nextui-org/react";
import ShuffleIcon from "@mui/icons-material/Shuffle";

/**
* Shuffle by doing Fisher-Yates
*/
const BGMShuffle = (props: any) => {
    const { bgm, forceUpdate, setForceUpdate } = props;
    return (
        <Tooltip content="Shuffle">
            <Button variant="light" size="md" isIconOnly aria-label="shuffle" onClick={() => {
                for (let index = bgm.current.length - 1; index > 0; index--) {
                    let j = Math.floor(Math.random() * (index + 1));
                    [bgm.current[index], bgm.current[j]] = [bgm.current[j], bgm.current[index]];
                }
                console.log(bgm);
                setForceUpdate(!forceUpdate);
            }}><ShuffleIcon/>
            </Button>
        </Tooltip>
    );
}

export default BGMShuffle;