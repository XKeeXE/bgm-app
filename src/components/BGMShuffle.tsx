/**
* Shuffle by doing Fisher-Yates
*/
const BGMShuffle = (props: any) => {
    const { bgm } = props;
    return <button className='button' onClick={() => {
        for (let index = bgm.current.length - 1; index > 0; index--) {
            let j = Math.floor(Math.random() * (index + 1));
            [bgm.current[index], bgm.current[j]] = [bgm.current[j], bgm.current[index]];
        }
        console.log(bgm);
    }}>Shuffle Queue</button>
}

export default BGMShuffle;