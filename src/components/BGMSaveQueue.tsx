import { IconButton, Tooltip } from '@mui/material';
import SaveQueueIcon from '@mui/icons-material/Save';
import fs from 'fs';

/**
 * Will save queue on a json called BGMQUEUE.txt
 * @param props bgm
 * @returns the Save Queue button
 */
const BGMSaveQueue = (props: any) => {
    const { bgm } = props;
    return (
        <Tooltip title="Save Queue">
            <IconButton onClick={() => {
                let jsonBGM = JSON.stringify(bgm.current);
                fs.writeFileSync('BGMQUEUE.txt', jsonBGM, 'utf8');
                console.log("queue saved")
            }}><SaveQueueIcon/>
            </IconButton>
        </Tooltip>
    );
}

export default BGMSaveQueue;