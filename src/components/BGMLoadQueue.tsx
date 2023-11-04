import { Button, Tooltip } from "@nextui-org/react";
import { useRef } from "react";
import { FileDownload } from "@mui/icons-material";

/**
 * Will load queue from json and play next in queue
 * @param props GetBGMJson and PlayNextInQueue functions
 * @returns the Load Queue button
 */
const BGMLoadQueue = (props: any) => {
    const { SetBGMJson, GetBGMJson, PlayNextInQueue} = props;
    const firstLoad = useRef(true);
    return (
        <Tooltip content="Load Queue">
            <Button variant="light" size="lg" isIconOnly aria-label="load queue" onClick={() => {
                console.log("Queue Loaded")
                if (firstLoad.current == true) { // if its the first time the queue is loaded
                    firstLoad.current = false;
                    GetBGMJson(); // get bgm from json
                } else { // else save the current queue (works exactly like skip but with save)
                    SetBGMJson(); // set bgm to json
                    GetBGMJson(); // get bgm from json
                }
                PlayNextInQueue(); // play the next unplayed track from the json
            }}><FileDownload/>
            </Button>
        </Tooltip>
    );
}

export default BGMLoadQueue;