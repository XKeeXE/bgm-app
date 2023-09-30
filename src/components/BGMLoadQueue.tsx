import fs from 'fs';

function BGMLoadQueue(props: any) {
    return (
        <button onClick={() => {
            const data = fs.readFileSync('BGMQUEUE.txt', 'utf8');
            const jsonBGM = JSON.parse(data);
            for (let index = 0; index < props.bgm.length; index++) {
                props.bgm[index] = jsonBGM[index];
            }
            console.log(props.message);
            // console.log(props.bgm);
        }}>Load Queue</button>
    );
}

export default BGMLoadQueue;