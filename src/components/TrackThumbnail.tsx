// import { ipcRenderer } from "electron";
const { ipcRenderer } = require('electron');
import { Paper } from "@mui/material";
import { Image } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";

import defaultThumbnail from '../assets/NoTrackThumbnail.png';

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
                ipcRenderer.send('track-thumbnail', base64);
                setThumbnail(base64);
            },
            onError: function(error: any) {
                setThumbnail(defaultThumbnail);
                console.log(':(', error.type, error.info);
            }
        })
        
    }, [currentUrl])
    return (
        <div className="relative items-center text-center">
            <Paper style={{ width: width, maxWidth: width, height: height, maxHeight: height, backgroundColor: 'black', opacity: 1 }}>
                {noThumbnail.current ? <p className=''>No Track Playing</p> : 
                <img src={thumbnail} width={"100%"} style={{ 
                    maxWidth: width, 
                    maxHeight: height,
                }}
                />}
            </Paper>
        </div>
    );
}

export default TrackThumbnail;