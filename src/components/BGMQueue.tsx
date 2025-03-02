import { useContext, useEffect, useRef, useState } from "react";
import { BGMContext } from "../App";
import { Spinner } from "@nextui-org/react";

interface initialDnDState {
    draggedFrom: number | null,
    draggedTo: number | null,
    isDragging: boolean,
    originalOrder: trackQueued[],
    updatedOrder: trackQueued[]
}

interface trackQueued {
    item: string,
    url: string,
    thumbnail: string,
}

const BGMQueue = () => {
    const { bgm, bgmQueue, currentTrack, forceUpdate } = useContext(BGMContext);

    const [tempQueue, setTempQueue] = useState<trackQueued[]>([]);
    const result = useRef<string>('None');

    useEffect(() => {

    }, [])

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
 
        // index of the item being dragged
        const draggedFrom = dragAndDrop.draggedFrom; 

        // index of the droppable area being hovered
        const draggedTo = Number(e.currentTarget.dataset.position); 

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
        setTempQueue(dragAndDrop.updatedOrder);
  
        setDragAndDrop({
            ...dragAndDrop,
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
                item: track.title,
                url: track.url,
                thumbnail: '',
            });
            
        }

        result.current = `${bgmQueue.current.getNextTenTracks().length} / ${bgmQueue.current.length()}`
        await window.api.readThumbnail(queue.map(track => track.url)).then(thumbnails => {
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

    //max-w-[calc(50px+20%)] min-w-[calc(50px+20%)] h-[calc(100%-30px)]
    // {/* <div className="flex flex-col items-center w-full h-full justify-center ">
    //     <span className="font-custom font-bold select-none">Results</span>
    //     <span className="font-custom text-sm">{result.current}</span>
    // </div> */}
    return (
            <ul className="queue-background list-inside flex flex-col h-full">
                <li className="results flex flex-row justify-center rounded-tl-xl ">Results {result.current}</li>
                {tempQueue.map((track, index) => 
                <li data-position={index} key={track.item} draggable onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} onDragLeave={onDragLeave} 
                  className={`queue-track relative tooltip text-xs flex flex-row items-center gap-1 pl-1 pr-1 flex-1 ${dragAndDrop && dragAndDrop.draggedTo === index ? `bg-green-400 border-dashed` : ``}`}>
                    {track.thumbnail === '' ? 
                    <Spinner/>
                    : <img className="rounded-sm aspect-video" src={track.thumbnail} height={50} width={50}/>
                    }
                    <span className="line-clamp-2 xl:line-clamp-3">{track.item}</span>
                    <span className="tooltiptext left-[108%]" style={{ 
                        visibility: dragAndDrop.isDragging ? 'hidden' : 'visible'
                    }}>{track.item}</span>
                </li>)}
            </ul>
    )
}

export default BGMQueue;