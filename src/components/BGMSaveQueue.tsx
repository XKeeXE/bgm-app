import fs from 'fs';

const BGMSaveQueue = (props: any) => {
    const { bgm } = props;
    return (
        <button onClick={() => {
            let jsonBGM = JSON.stringify(bgm);
            fs.writeFileSync('BGMQUEUE.txt', jsonBGM, 'utf8');
            console.log("queue saved")
        }}>Save Queue</button>
    );
}

export default BGMSaveQueue;