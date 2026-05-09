import { useEffect, useMemo, useRef, useState } from 'react';
import { usePopoverMenu } from './PopoverMenu/PopoverMenu';
import { PopoverMenuItem } from './PopoverMenu/types';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    Row,
    useReactTable,
  } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

import * as Icons from '../toolbox/utils/Icons';

import BGMInputSearch from './BGMInputSearch';
import { Track } from '../interfaces/store/player';
import { useStore } from '../toolbox/store';
import { DEFAULT_TRACK } from '../toolbox/store/player';

const BGMTableList = () => {
    const bgm = useStore((state) => state.player.bgm);
    const data = useMemo(() => Array.from(bgm.values()), [bgm]);
    const currentTrack = useStore((state) => state.player.currentTrack);


    const selectedContext = useRef<Track>(DEFAULT_TRACK);
    const { showPopoverMenu } = usePopoverMenu();

    const [viewport, setViewport] = useState({
        width: 0,
        height: 0,
    });
    const [searchingID, setSearchingID] = useState<number>(-1);
    const searching = useRef<boolean>(false);
    const tableDivRef = useRef<HTMLDivElement>(null)

    function TableInfo(header: React.ReactNode, className?: string): React.ReactElement {
        return (<div className={className}>
                    {header}
                </div>)
    }

    const columnHelper = createColumnHelper<Track>()

    const columns = [
        columnHelper.accessor('id', {
            header: () => TableInfo(<Icons.Number/>),
            maxSize: 80,
            enableResizing: false,
            cell: row => TableInfo(row.getValue(), 'font-bold text-center')
        }),
        // columnHelper.accessor('type', {
        //     header: () => TableInfo(<Icons.Type/>),
        //     maxSize: 60,
        //     enableResizing: false,
        //     cell: row => TableInfo(CheckType(row.getValue()), 'flex justify-center')
        // }),
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
        ScrollToIndex(currentTrack.id);
    }, [currentTrack])

    function ScrollToIndex(index: number) {
        const customEvent = new CustomEvent('handleTrackScroll', {
            detail: { index },
        });
        window.dispatchEvent(customEvent);
    }

    const items: PopoverMenuItem[] = [{
        type: 'button',
        id: 'Queue',
        label: 'Queue',
        icon: <Icons.Queue/>,
        onClick: () => useStore.getState().player.queueTrack(selectedContext.current),
    }, 
    {
        type: 'button',
        id: 'Stack',
        label: 'Stack',
        icon: <Icons.Stack/>,
        onClick: () => useStore.getState().player.stackTrack(selectedContext.current),
    }, 
    {
        type: 'button',
        id: 'Play',
        label: 'Play',
        icon: <Icons.PlayTrack/>,
        onClick: () => {
            useStore.getState().player.removeFromQueue(selectedContext.current);
            useStore.getState().player.playTrack(selectedContext.current);
        },
    },
    { type: 'separator' },
    {
        type: 'button',
        id: 'Clipboard',
        label: 'Clipboard',
        icon: <Icons.Clipboard/>,
        onClick: () => {
            const clipboardedTrack = selectedContext.current.title;
            window.general.log(`Copied \n${clipboardedTrack}`);
            navigator.clipboard.writeText(clipboardedTrack);
        },
    },
    {
        type: 'button',
        id: 'Info',
        label: 'Info',
        icon: <Icons.Info/>,
        onClick: () => window.general.log(`${JSON.stringify(selectedContext)}`),
    },
    {
        type: 'button',
        id: 'Remove',
        label: 'Remove',
        icon: <Icons.Remove/>,
        onClick: () => {
            // First remove the track, then reorganize the tracks, then reload the queue
            // bgm.delete(selectedContext.current.id);
        },
    },]

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
            <table className='' style={{ display: 'grid' }}>
                <thead className=''
                style={{
                    display: 'grid',
                    top: 0,
                    zIndex: 1,
                    }}
                onContextMenu={(e) => e.preventDefault()}
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
                        const row = rows[virtualRow.index] as Row<Track>
                        return (
                            <tr className={`absolute cursor-pointer select-none rounded-md clickable 
                                ${row.index === searchingID && row.index === currentTrack.id // searching + playing style
                                ? 'playingsearching' 
                                : (row.index === currentTrack.id // playing style 
                                    ? 'playing' 
                                    : (row.index === searchingID // searching style
                                        ? 'searching'
                                        : ''
                                    )
                                )}`
                            } 
                                data-index={virtualRow.index} // Needed for dynamic row height measurement
                                ref={node => rowVirtualizer.measureElement(node)} // Measure dynamic row height
                                key={row.id}
                                style={{
                                    transform: `translateY(${virtualRow.start}px)`, // This should always be a `style` as it changes on scroll
                                }}
                                onClick={() => {
                                    const track = bgm.get(row.index)!;
                                    useStore.getState().player.removeFromQueue(track);
                                    useStore.getState().player.playTrack(track);
                                }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    selectedContext.current = bgm.get(row.index)!;
                                    showPopoverMenu(e.clientX, e.clientY, { id: 'track-context-menu', items });
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
    </div>
    </>
	)
}

export default BGMTableList;
