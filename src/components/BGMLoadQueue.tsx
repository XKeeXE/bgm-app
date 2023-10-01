import fs from 'fs';

function BGMLoadQueue(props: any) {
    console.log("queue loaded")
    return (
        <button onClick={() => {
            props.load;
            props.play;
        }}>Load Queue</button>
    );
}

export default BGMLoadQueue;