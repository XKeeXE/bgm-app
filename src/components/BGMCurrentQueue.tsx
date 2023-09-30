import BGMLoadQueue from './BGMLoadQueue';
import fs from 'fs';

const BGMCurrentQueue = (props: any) => {
    const data = fs.readFileSync('BGMQUEUE.txt', 'utf8');
    const jsonBGM = JSON.parse(data);
    
    // Idea: hacerlo como アイギス

    // return (
    //     <ul className='bgm-queue'>
    //         {props.tracks.map((item: any) =>
    //         <li></li>
    //     </ul>
    // );
}

export default BGMCurrentQueue;