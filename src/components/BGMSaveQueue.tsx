import fs from 'fs';

const BGMSaveQueue = (props: any) => {
    return (
        <button onClick={() => {
            let jsonBGM = JSON.stringify(props.bgm);
            fs.writeFileSync('BGMQUEUE.txt', jsonBGM, 'utf8');
            console.log(props.message);
        }
        }>Save Queue</button>
    );
}

export default BGMSaveQueue;