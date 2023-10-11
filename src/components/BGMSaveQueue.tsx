import fs from 'fs';

/**
 * Will save queue on a json called BGMQUEUE.txt
 * @param props bgm
 * @returns the Save Queue button
 */
const BGMSaveQueue = (props: any) => {
    const { bgm } = props;
    return (
        <button className='button' onClick={() => {
            let jsonBGM = JSON.stringify(bgm.current);
            fs.writeFileSync('BGMQUEUE.txt', jsonBGM, 'utf8');
            console.log("queue saved")
        }}>Save Queue</button>
    );
}

export default BGMSaveQueue;