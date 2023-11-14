import { ipcRenderer } from "electron";
import { useEffect, useRef, useState } from "react";

var jsmediatags = require("jsmediatags");

function TrackThumbnail(props: any) {
    const { currentUrl, width, height } = props;
    const noThumbnail = useRef<boolean>(true); // To indicate that there is no thumbnail because there is no track playing
    const [thumbnail, setThumbnail] = useState<string>(currentUrl);
    
    useEffect(() => {
        if (currentUrl === undefined) { // will only happen when first starting the app
            return;
        }
        noThumbnail.current = false;
        new jsmediatags.Reader(currentUrl).setTagsToRead(["picture"]).read({
            onSuccess: function(tag: any) {
                var image = tag.tags.picture;
                var base64String = "";
                for (var index = 0; index < image.data.length; index++) {
                    base64String += String.fromCharCode(image.data[index]);
                }
                var base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
                setThumbnail(base64);
                ipcRenderer.send('track-thumbnail', base64);
            },
            onError: function(error: any) {
                console.log(':(', error.type, error.info);
            }
        })
        
    }, [currentUrl])
    return (
        <div className="relative items-center text-center">
            {noThumbnail.current ? <p className=' top-0'>No Track Playing</p> : ''}
            <img className="h-auto max-h-fit z-0 ml-auto mr-auto" src={thumbnail} width={width} height={height} />
            {/* <div className={noThumbnail.current ? 'absolute text-center self-center bg-white' : 'opacity-0'}>No Track Playing</div> */}
        </div>
    );
}

export default TrackThumbnail;