import { Card, CardBody, CardFooter, CardHeader, Spacer } from "@nextui-org/react";
import BGMQueueResults from "./BGMQueueResults";
import { useEffect, useState } from "react";
import BGMCurrentQueue from "./BGMCurrentQueue";

const BGMQueueTracker = (props: any) => {
    const { currentUrl, bgm, tracks, forceUpdate, playedTracks, CheckTrackType } = props;
    const [results, setResults] = useState<string>("None");

    return (
        <>
        {/* <Card className=" bg-background/0" shadow={'none'} style={{

        }}>
            <CardHeader className="self-center align-middle items-center">
                <BGMQueueResults results={results}/>
            </CardHeader>
            <CardBody>
                <BGMCurrentQueue currentUrl={currentUrl} bgm={bgm} tracks={tracks} forceUpdate={forceUpdate} setResults={setResults} playedTracks={playedTracks} CheckTrackType={CheckTrackType}/>
            </CardBody>
        </Card>
         */}
        <Spacer y={2}/>
        <div className="flex flex-col">
            <BGMQueueResults results={results}/>
            <Spacer y={2}/>
            <BGMCurrentQueue currentUrl={currentUrl} bgm={bgm} tracks={tracks} forceUpdate={forceUpdate} setResults={setResults} playedTracks={playedTracks} CheckTrackType={CheckTrackType}/>

        </div>
        </>
    )

}

export default BGMQueueTracker;