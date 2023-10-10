/**
 * Will load queue from json and play next in queue
 * @param props GetBGMJson and PlayNextInQueue functions
 * @returns the Load Queue button
 */
const BGMLoadQueue = (props: any) => {
    const { GetBGMJson, PlayNextInQueue} = props;
    return (
        <button className='button' onClick={() => {
            console.log("Queue Loaded")
            GetBGMJson(); // get bgm from json
            PlayNextInQueue(); // play the next unplayed track from the json
        }}>Load Queue</button>
    );
}

export default BGMLoadQueue;