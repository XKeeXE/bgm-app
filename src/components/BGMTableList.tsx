import { useContext, useEffect, useRef, useState } from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    Row,
    useReactTable,
  } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

import * as Icons from './Icons';

import { track, UI } from './types/types';
import { BGMContext } from '../App';
import { ContextMenu, ContextMenuItem, ContextMenuTrigger } from 'rctx-contextmenu';
import BGMInputSearch from './BGMInputSearch';

const nullTrack: track = {
    id: -1,
    url: '',
    title: '',
    queue: {
        pos: -1,
        played: false
    }
}

const BGMTableList = (props: {
    data: track[],
}) => {
    const { data } = props;
    const { bgm, bgmQueue, queueTracker, currentTrack, PlayTrack, ForceUpdate, ResetQueue, ScrollToIndex } = useContext(BGMContext);

    const selectedContext = useRef<track>(nullTrack);

    const [viewport, setViewport] = useState({
        width: 0,
        height: 0,
    });
    const [searchingID, setSearchingID] = useState<number>(-1);
    const searching = useRef<boolean>(false);
    const tableDivRef = useRef<HTMLDivElement>(null)

    function TableInfo(header: React.ReactNode, className?: string): JSX.Element {
        return (<div className={className}>
                    {header}
                </div>)
    }

    const columnHelper = createColumnHelper<track>()

    const columns = [
        columnHelper.accessor('id', {
            header: () => TableInfo(<Icons.Number/>),
            maxSize: 80,
            enableResizing: false,
            cell: row => TableInfo(row.getValue(), 'font-bold text-center')
            }),
        columnHelper.accessor('title', {
            header: () => TableInfo('TITLE', 'flex items-start'),
            cell: row => <span className='overflow-hidden line-clamp-1 '>{row.getValue()}</span>,
            enableResizing: false,
            minSize: viewport.width,
        }),
        // columnHelper.accessor('duration', {
        //     id: 'duration',
        //     header: () => TableInfo(<Icons.Duration/>, 'flex items-start'),
        //     cell: row => TableInfo(row.getValue(), ''),
        //     maxSize: 80,
        //     enableResizing: false,
        // }),
        columnHelper.accessor('queue.pos', {
            id: 'pos',
            header: () => TableInfo(<Icons.QueuePos/>),
            cell: row => TableInfo(row.getValue(), ' text-center'),
            enableResizing: false,
            maxSize: 60,
        }),
        columnHelper.accessor('queue.played', {
            id: 'played',
            header: () =>  TableInfo(<Icons.Played/>),
            cell: row => TableInfo(row.getValue() ? <Icons.PlayedTrue/> : <Icons.PlayedFalse/>, 'flex justify-center'),
            enableResizing: false,
            maxSize: 60,
        }),
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const { rows } = table.getRowModel()
    
    const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 32, // Estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableDivRef.current,
    measureElement: element => element?.getBoundingClientRect().height,
    overscan: 1,
    })

    useEffect(() => {
        function handleViewportChange() {
            // console.log(window.innerHeight);
            setViewport({width: window.innerWidth-538, height: window.innerHeight-140});
        }
        handleViewportChange();
        const resizeObserver = new ResizeObserver(handleViewportChange);
        if (tableDivRef.current) {
            resizeObserver.observe(tableDivRef.current);
        }

        function handleTrackScroll(e: CustomEvent) {
            const { index } = e.detail
            let offset = index as number // For some weird reason the scrollToIndex is not in the center
            if (index < bgm.size) {
                offset -= 2
            }
            rowVirtualizer.scrollToIndex(offset+2, {
                align: 'center',
                behavior: 'auto'
            })
        }
        window.addEventListener('handleTrackScroll', handleTrackScroll as EventListener);
        window.addEventListener('scroll', handleTrackScroll as EventListener)
        return () => {
            window.removeEventListener('handleTrackScroll', handleTrackScroll as EventListener);
            if (tableDivRef.current) {
                resizeObserver.unobserve(tableDivRef.current);
            }
        };
    }, [])

    useEffect(() => {
        ScrollToIndex(currentTrack.id)
    }, [currentTrack])

    const items: UI[] = [{
        key: 'Queue',
        tooltip: 'Add to queue',
        icon: <Icons.Queue/>,
        onClick: function (): void {
            let track: track;
            // const selectedTrack = bgm.get(selectedContext)!;
            selectedContext.current.queue.played = false;
            let currentPos = selectedContext.current.queue.pos; // We have to change the pos mid way so we know the exact pos
            
            if (queueTracker.current == -1) { // Add it to the bottom of the queue
                for (let index = 0; index < bgm.size; index++) {
                    track = bgm.get(index)!;
                    if (track.queue.pos < currentPos) { // Ignore all previous that come before the selected track queue pos
                        continue;
                    } 
                    if (track.queue.pos == currentPos) { // Set the selected track to the bottom of the queue
                        selectedContext.current.queue.pos = bgm.size-1 
                        continue;
                    }
                    track.queue.pos -= 1
                }
                ForceUpdate();
                return;
            }
            queueTracker.current++;
            // TODO loop the queuetracker to see if the item was added, if it was then just organize the pos, else do below
            for (let index = 0; index < bgm.size; index++) {
                track = bgm.get(index)!;
                if (track.queue.pos > currentPos) { // Ignore all tracks that are in the front of the selected track queue pos
                    continue;
                } 
                if (track.queue.pos == currentPos) { // Set the selected track to the position of the queue tracker
                    selectedContext.current.queue.pos = queueTracker.current;
                    continue;
                }
                if (queueTracker.current > track.queue.pos) { // Ignore the previous inserted tracks in the queue
                    continue;
                }
                
                track.queue.pos += 1
            }
            ForceUpdate();
            ResetQueue(bgm.values());
            console.log(`Queued: \n${selectedContext.current.title}`);
            console.log(selectedContext.current)
        }
    }, 
    {
        key: 'Stack',
        tooltip: '',
        icon: <Icons.Stack/>,
        onClick: function (): void {
            queueTracker.current = 0;
            let track: track;
            let currentPos = selectedContext.current.queue.pos; // We have to change the pos mid way so we know the exact pos
            selectedContext.current.queue.played = false;
            for (let index = 0; index < bgm.size; index++) {
                track = bgm.get(index)!;
                if (track.queue.pos == currentPos) { // Send the selected track to the front of the queue
                    selectedContext.current.queue.pos = 0;
                    continue;
                }
                if (track.queue.pos > currentPos) { // If the queue pos is higher than the selected track then skip it
                    continue;
                }
                track.queue.pos += 1;
            }
            ForceUpdate();
            ResetQueue(bgm.values());
            console.log(`Stacked: \n${selectedContext.current.title}`);
            console.log(selectedContext.current)
        }
    }, 
    {
        key: 'Play',
        tooltip: '',
        icon: <Icons.PlayTrack/>,
        onClick: function (): void {
            PlayTrack(selectedContext.current);
        }
    }, 
    {
        key: 'Clipboard',
        tooltip: '',
        icon: <Icons.Clipboard/>,
        onClick: function (): void {
            const clipboardedTrack = selectedContext.current.title;
            console.log(`Copied \n${clipboardedTrack}`);
            navigator.clipboard.writeText(clipboardedTrack);
        }
    },
    {
        key: 'Info',
        tooltip: '',
        icon: <Icons.Info/>,
        onClick: function (): void {
            console.log(selectedContext);
        }
    }]

	return (
    <>
    <div tabIndex={-1}
    className={`overflow-x-auto w-full`}
    ref={tableDivRef}
    style={{
        minHeight: `${viewport.height}px`,
        maxHeight: `${viewport.height}px`
    }}>
        <BGMInputSearch searching={searching} setSearchingID={setSearchingID}/>
        <ContextMenuTrigger id="track-context">
            <table className='' style={{ display: 'grid' }}>
                <thead className=''
                style={{
                    display: 'grid',
                    top: 0,
                    zIndex: 1,
                    }}
                onContextMenu={() => {
                    selectedContext.current = nullTrack; // MUST FIX THIS TO NOT OPEN CONTEXT
                }}
                >   
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} >
                        {headerGroup.headers.map((header) => {
                        return (
                            <th className='relative select-none pt-[2px] pb-[4px]'
                            key={header.id}
                            colSpan={header.colSpan}
                            style={{ width: header.getSize() }}
                            >
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                    )}
                                {header.column.getCanResize() && (
                                <div
                                    onMouseDown={header.getResizeHandler()}
                                    onTouchStart={header.getResizeHandler()}
                                    className={`resizer ${
                                    header.column.getIsResizing() ? 'isResizing' : ''
                                    }`}
                                ></div>
                                )}
                            </th>
                        )
                        })}
                    </tr>
                    ))}
                </thead>
                <tbody style={{ 
                    display: 'grid',
                    height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
                    position: 'relative', //needed for absolute positioning of rows
                }}>
                    {rowVirtualizer.getVirtualItems().map(virtualRow => {
                        const row = rows[virtualRow.index] as Row<track>
                        return (
                            <tr className={`absolute cursor-pointer select-none  ${row.index === searchingID || row.index === currentTrack.id ? ' bg-blue-100 hover:border-blue-300 ' : ' hover:bg-slate-200'}`} 
                                data-index={virtualRow.index} //needed for dynamic row height measurement
                                ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
                                key={row.id}
                                style={{
                                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                                }}
                                onClick={() => {
                                    bgmQueue.current.remove(bgm.get(row.index)!);
                                    PlayTrack(bgm.get(row.index)!);
                                }}
                                onContextMenu={() => {
                                    selectedContext.current = bgm.get(row.index)!;
                                }}
                                >
                                {row.getVisibleCells().map(cell => {
                                    return (
                                    <td
                                        key={cell.id}
                                        style={{
                                            width: cell.column.getSize(),
                                        }}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </ContextMenuTrigger>
    </div>
    <ContextMenu id="track-context" className="rounded-sm">
        {items.map((item, index) => (
            <ContextMenuItem key={item.key} onClick={item.onClick} className={`${index === 2 ? 'border-b-1' : ''} `}>
                <span className='flex flex-row gap-2'>{item.icon}{item.key}</span>
            </ContextMenuItem>
        ))}
    </ContextMenu>
    </>
	)
}

export default BGMTableList;
