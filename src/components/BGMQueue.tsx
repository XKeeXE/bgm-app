import { useEffect, useRef, useState } from "react";
import { Track } from "../interfaces/store/player";
import { useStore } from "../toolbox/store";

interface initialDnDState {
    draggedFrom: number | null,
    draggedTo: number | null,
    isDragging: boolean,
    originalOrder: trackQueued[],
    updatedOrder: trackQueued[]
}

interface trackQueued {
    track: Track,
    thumbnail: string,
}

const BGMQueue = () => {
    const bgm = useStore(state => state.player.bgm);
    const bgmQueue = useStore(state => state.player.bgmQueue);
    const currentTrack = useStore(state => state.player.currentTrack);

    const [tempQueue, setTempQueue] = useState<trackQueued[]>([]);
    const result = useRef<string>('None');

    useEffect(() => {
        ReadQueue();
    }, [bgm, currentTrack, bgmQueue])

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
        bgmQueue.getNextTenTracks().forEach(track => {
            queuePos.push(track.queue.pos)
        })

        const orderedItems = dragAndDrop.updatedOrder
            .slice(0, queuePos.length)
            .map((item, i) => ({ id: item.track.id, newPos: queuePos[i] }));

        useStore.getState().player.reorderQueue(orderedItems);
        setTempQueue(dragAndDrop.updatedOrder);

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
        const queue: trackQueued[] = [];
        for (const track of bgmQueue.getNextTenTracks()) {
            queue.push({
                track: {...track},
                thumbnail: '',
            });
        }

        result.current = `${bgmQueue.getNextTenTracks().length} / ${bgmQueue.length()}`
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
                <div className="rounded-sm aspect-video bg-gray-300 animate-pulse" style={{ height: 50, width: 50 }}/>
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