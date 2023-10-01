import { useState } from "react";

var jsmediatags = require("jsmediatags");

function TrackThumbnail(props: any) {
    // console.log(props.url);
    if (props.url === undefined) {
        return;
    }
    const [thumbnail, setThumbnail] = useState<string>(props.url);
    new jsmediatags.Reader(props.url).setTagsToRead(["picture"]).read({
        onSuccess: function(tag: any) {
            var image = tag.tags.picture;
            var base64String = "";
            for (var index = 0; index < image.data.length; index++) {
                base64String += String.fromCharCode(image.data[index]);
            }
            var base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
            setThumbnail(base64);
        },
        onError: function(error: any) {
            // setThumbnail("something")
            console.log(':(', error.type, error.info);
        }
    })
    return (
        <img src={thumbnail}/>
    );
}

export default TrackThumbnail;