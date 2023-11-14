import { Button, Tooltip } from '@nextui-org/react';
import SaveQueueIcon from '@mui/icons-material/Save';
import fs from 'fs';

/**
 * Will save queue on a json called BGMQUEUE.txt
 * @param props bgm
 * @returns the Save Queue button
 */
const BGMSaveQueue = (props: any) => {
    const { bgm, saveQueueTimer } = props;
    return (
        <Tooltip content="Save Queue">
            <Button variant="light" size="lg" isIconOnly aria-label="save queue" onClick={() => {
                let jsonBGM = JSON.stringify(bgm.current);
                console.log(saveQueueTimer.current);
                saveQueueTimer.current = 0;
                fs.writeFileSync('BGMQUEUE.txt', jsonBGM, 'utf8');
                console.log("queue saved")
            }}><SaveQueueIcon/>
            </Button>
        </Tooltip>
    );
}

export default BGMSaveQueue;