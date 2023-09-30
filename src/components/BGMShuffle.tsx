function BGMShuffle(props: any) {
    return <button onClick={() => {
        for (let index = props.bgm.length - 1; index > 0; index--) {
            let j = Math.floor(Math.random() * (index + 1));
            [props.bgm[index], props.bgm[j]] = [props.bgm[j], props.bgm[index]];
        }
    }}>Shuffle Queue</button>
}

export default BGMShuffle;