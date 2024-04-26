const { ipcRenderer } = require('electron');
import { useEffect, useRef, useState } from "react";
import { Image } from '@nextui-org/react';

import defaultThumbnail from '../assets/NoTrackThumbnail.png';

var jsmediatags = require("jsmediatags");

function TrackThumbnail(props: any) {
    const { currentUrl } = props;
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
                ipcRenderer.send('trackThumbnail', base64);
                setThumbnail(base64);
            },
            onError: function(error: any) {
                setThumbnail(defaultThumbnail);
                ipcRenderer.send('trackThumbnail', defaultThumbnail);
                console.log(':(', error.type, error.info);
            }
        })
        
    }, [currentUrl])
    return (
        <Image className="w-full h-full object-cover " removeWrapper src={thumbnail} style={{
            height: 'auto',
        }}/>
    );
}

export default TrackThumbnail;