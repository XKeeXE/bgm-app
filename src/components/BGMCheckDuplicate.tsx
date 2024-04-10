import { Button, Tooltip } from "@nextui-org/react";
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import { useRef } from "react";

// An exception enum for those tracks that have {-#} in their title
enum EXCEPTIONS {
    'The Rising of the SHIELD HERO OST - Campbell 1-1',
    '04 - 3-31',
    'Mission in Snowdriftland Soundtrack - 03 - World 1-2',
    'Jumping Flash! OST 17 - World 5-3',
    length
}

const BGMCheckDuplicate = (props: any) => {
    const { tracks, CheckTrackType } = props;
    const result = useRef<any>();
    return (
        <Tooltip content="Check">
            <Button variant="light" size="lg" isIconOnly aria-label="check duplicate" onClick={() => {
                const regexp = /[-]\d+$/; // regexp to find tracks that end with -#
                let trackName: string;
                result.current = []; // array which contains duplicated tracks
                checkBGM: for (let index = 0; index < tracks.current.length; index++) { // check the bgm list for duplicates
                    trackName = CheckTrackType(tracks.current[index]); // remove the type format from track name
                    if (trackName.match(regexp) != null) { // if a track contains {-#}, then it must be a duplicate
                        for (let exceptionIndex = 0; exceptionIndex < EXCEPTIONS.length; exceptionIndex++) { // there are exceptions though where a track end with {-#} but no duplicate
                            if (trackName.localeCompare(EXCEPTIONS[exceptionIndex]) == 0) { // if exception detected, then skip to the next track
                                continue checkBGM; // skip to the next track
                            }
                        }
                        result.current.push(trackName); // insert the track name in the result array if not an exception and is a duplicate
                    }
                }
                console.log(result.current);
            }}><YoutubeSearchedForIcon/>
            </Button>
        </Tooltip>
    )
}

export default BGMCheckDuplicate;