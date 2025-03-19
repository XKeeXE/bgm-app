import { useContext, useEffect, useRef, useState } from "react";
import { BGMContext } from "../App";
import { Spinner } from "@nextui-org/react";
import { track } from "./types/types";

interface initialDnDState {
    draggedFrom: number | null,
    draggedTo: number | null,
    isDragging: boolean,
    originalOrder: trackQueued[],
    updatedOrder: trackQueued[]
}

interface trackQueued {
    track: track,
    thumbnail: string,
}

const BGMQueue = () => {
    const { bgm, bgmQueue, currentTrack, forceUpdate, ForceUpdate, ResetQueue} = useContext(BGMContext);

    const [tempQueue, setTempQueue] = useState<trackQueued[]>([]);
    const result = useRef<string>('None');

    useEffect(() => {
        ReadQueue();
    }, [bgm, currentTrack, forceUpdate])

    const [dragAndDrop, setDragAndDrop] = useState<initialDnDState>({
        draggedFrom: null,
        draggedTo: null,
        isDragging: false,
        originalOrder: [],
        updatedOrder: []
    });

    function onDragStart(e: any) {
        const initialPosition = Number(e.currentTarget.dataset.position);
  
        setDragAndDrop({
            ...dragAndDrop,
            draggedFrom: initialPosition,
            isDragging: true,
            originalOrder: tempQueue
        });
    }

    function onDragOver(e: any) {
        e.preventDefault();
        let newList = dragAndDrop.originalOrder;
        const draggedFrom = dragAndDrop.draggedFrom; // index of the item being dragged
        const draggedTo = Number(e.currentTarget.dataset.position); // index of the droppable area being hovered
        const itemDragged = newList[draggedFrom!];
        const remainingItems = newList.filter((_item, index) => index !== draggedFrom);

        newList = [
            ...remainingItems.slice(0, draggedTo),
            itemDragged,
            ...remainingItems.slice(draggedTo)
        ];
            
        if (draggedTo !== dragAndDrop.draggedTo){
            setDragAndDrop({
                ...dragAndDrop,
                updatedOrder: newList,
                draggedTo: draggedTo
            })
        }
    }

    function onDrop() {
        const queuePos: number[] = [];
        bgmQueue.current.getNextTenTracks().forEach(track => {
            queuePos.push(track.queue.pos) // Save the queue pos for later because we can't change it directly as it will override it
        })

        for (let index = 0; index < queuePos.length; index++) {
            dragAndDrop.updatedOrder[index].track.queue.pos = queuePos[index]; // Reassign the queue pos to the new order
        }

        ResetQueue(bgm.values());
        setTempQueue(dragAndDrop.updatedOrder);
        ForceUpdate()

        setDragAndDrop({
            originalOrder: dragAndDrop.updatedOrder,
            updatedOrder: dragAndDrop.updatedOrder,
            draggedFrom: null,
            draggedTo: null,
            isDragging: false
        });
    }

    function onDragLeave() {
        setDragAndDrop({
            ...dragAndDrop,
            draggedTo: null
        });
    }

    async function ReadQueue() {
        const queue: trackQueued[] = []; // the array of tracks of the next 10 tracks if possible
        for (let track of bgmQueue.current.getNextTenTracks()) {
            queue.push({
                track: {...track},
                thumbnail: '',
            });
        }

        result.current = `${bgmQueue.current.getNextTenTracks().length} / ${bgmQueue.current.length()}`
        await window.api.readThumbnail(queue.map(track => track.track.url)).then(thumbnails => {
            const queueThumbnails = thumbnails as string[];
            queueThumbnails.forEach((thumbnail, index) => {
                queue[index].thumbnail = thumbnail
            })
        });
        setTempQueue(queue);
    }

    useEffect(() => {
        setDragAndDrop({
            ...dragAndDrop,
            isDragging: false,
           });
    }, [currentTrack])

    return (
            <ul className="queue-background list-inside flex flex-col h-full ">
                <li className="results flex flex-row justify-center rounded-tl-xl ">Results {result.current}</li>
                {tempQueue.map((track, index) => 
                <li data-position={index} key={track.track.title} draggable 
                className={`queue-track relative tooltip text-xs flex flex-row items-center gap-1 pl-1 pr-1 flex-1 border-2 
                ${dragAndDrop && dragAndDrop.draggedTo === index ? ` border-dashed rounded-lg border-[#00BFFF]` : `border-[transparent]`}`}

                onDragStart={onDragStart} 
                onDragOver={onDragOver} 
                onDrop={onDrop} 
                onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        onDragLeave();
                    }
                }}>
                    {track.thumbnail === '' ? 
                    <Spinner/>
                    : <img className="rounded-sm aspect-video" src={track.thumbnail} height={50} width={50}/>
                    }
                    <span className="line-clamp-2 xl:line-clamp-3">{track.track.title}</span>
                    <span className="tooltiptext left-[108%]" style={{ 
                        visibility: dragAndDrop.isDragging ? 'hidden' : 'visible'
                    }}>{track.track.title}</span>
                </li>)}
            </ul>
    )
}

export default BGMQueue;