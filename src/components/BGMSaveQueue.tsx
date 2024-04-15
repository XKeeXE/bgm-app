import { Button, Tooltip } from '@nextui-org/react';
import SaveQueueIcon from '@mui/icons-material/Save';
import fs from 'fs';
import { useEffect } from 'react';
import { ipcRenderer } from 'electron';

/**
 * Will save queue on a json called BGMQUEUE.txt
 * @param props 
 * bgm: contains the current queue to play
 * saveQueueTimer: the current timer to save the queue to set it to 0
 * @returns the Save Queue button
 */
const BGMSaveQueue = (props: any) => {
    const { bgm, saveQueueTimer } = props;

    function SaveQueue() {
        let jsonBGM = JSON.stringify(bgm.current);
        // console.log(saveQueueTimer.current);
        saveQueueTimer.current = 0;
        fs.writeFileSync('BGMQUEUE.txt', jsonBGM, 'utf8');
        console.log("queue saved")
    }
    
    useEffect(() => {
        ipcRenderer.send('sendSaveQueue', SaveQueue.toString());
        
    }, [])

    return (
        <Tooltip content="Save Queue">
            <Button variant="light" size="lg" isIconOnly aria-label="save queue" onClick={() => {
                SaveQueue();
            }}><SaveQueueIcon/>
            </Button>
        </Tooltip>
    );
}

export default BGMSaveQueue;