import { useState } from "react";

function TrackPause() {
    const [playing, setPlaying] = useState<boolean>(true);

    return (
        <button onClick={() => {
            setPlaying(!playing)
            console.log(playing);
        }}>Pause</button>
    );
}

export default TrackPause;