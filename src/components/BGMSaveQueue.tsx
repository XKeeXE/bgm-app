import fs from 'fs';

const BGMSaveQueue = (props: any) => {
    console.log("queue saved")
    return (
        <button onClick={props.save}>Save Queue</button>
    );
}

export default BGMSaveQueue;