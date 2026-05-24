import { useEffect, useMemo, useRef, useState } from 'react';
import { usePopover } from '@patch-kit/popover';
import Menu from './general/Menu';
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
import { singleTrackItems, multiTrackItems } from '../configs/track';

const BGMTableList = () => {
    const bgm = useStore((state) => state.player.bgm);
    const currentTrack = useStore((state) => state.player.currentTrack);
    const selectedIds = useStore((state) => state.app.selectedIds);
    const setSelectedIds = useStore((state) => state.app.setSelectedIds);
    const { showPopover } = usePopover();

    const data = useMemo(() => Array.from(bgm.values()), [bgm]);

    const [searchingID, setSearchingID] = useState<number>(-1);
    const [viewport, setViewport] = useState({
        width: 0,
        height: 0,
    });

    const selectedContext = useRef<Track>(DEFAULT_TRACK);
    const lastClickedId = useRef<number | null>(null);
    const searching = useRef<boolean>(false);
    const tableRef = useRef<HTMLDivElement>(null)

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
    getScrollElement: () => tableRef.current,
    measureElement: element => element?.getBoundingClientRect().height,
    overscan: 1,
    })

    useEffect(() => {
        function handleViewportChange() {
            setViewport({width: window.innerWidth-538, height: window.innerHeight-140});
        }
        handleViewportChange();
        const resizeObserver = new ResizeObserver(handleViewportChange);
        if (tableRef.current) {
            resizeObserver.observe(tableRef.current);
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
            if (tableRef.current) {
                resizeObserver.unobserve(tableRef.current);
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

    const singleItems = singleTrackItems(selectedContext);

	return (
    <>
        <div tabIndex={-1}
        className={`overflow-x-hidden w-full`}
        ref={tableRef}
        onWheel={(e) => {
            if (e.shiftKey || e.metaKey) {
                e.preventDefault();
                tableRef.current?.scrollBy({ top: e.deltaY });
            }
        }}
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
                                    )}
                                    ${selectedIds.has(row.index) ? 'selected' : ''}`
                                } 
                                    data-index={virtualRow.index} // Needed for dynamic row height measurement
                                    ref={node => rowVirtualizer.measureElement(node)} // Measure dynamic row height
                                    key={row.id}
                                    style={{
                                        transform: `translateY(${virtualRow.start}px)`, // This should always be a `style` as it changes on scroll
                                    }}
                                    onClick={(e) => {
                                        const track = bgm.get(row.index)!;
                                        if (e.ctrlKey || e.metaKey) {
                                            // Ctrl+Click: toggle this track in selection
                                            const next = new Set(selectedIds);
                                            next.has(row.index) ? next.delete(row.index) : next.add(row.index);
                                            setSelectedIds(next);
                                            lastClickedId.current = row.index;

                                        } else if (e.shiftKey && lastClickedId.current) {
                                            // Shift+Click: range select from lastClickedId to current
                                            const from = Math.min(lastClickedId.current, row.index);
                                            const to = Math.max(lastClickedId.current, row.index);
                                            const range = new Set<number>();
                                            for (let i = from; i <= to; i++) range.add(i);
                                            setSelectedIds(range);
                                        } else {
                                            // Plain click: play track and clear selection
                                            setSelectedIds(new Set());
                                            lastClickedId.current = row.index;
                                            useStore.getState().player.removeFromQueue(track);
                                            useStore.getState().player.playTrack(track);
                                        }
                                    }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        const track = bgm.get(row.index)!;
                                        if (selectedIds.size > 1 && selectedIds.has(row.index)) {
                                            // Multi-select context menu
                                            const selection = Array.from(selectedIds)
                                                .sort((a, b) => a - b)
                                                .map((id) => bgm.get(id)!)
                                                .filter(Boolean);
                                            showPopover(new DOMRect(e.clientX, e.clientY, 0, 0), <Menu items={multiTrackItems(selection)} />, { id: 'context-menu' });
                                        } else {
                                            // Single-track context menu — clear multi-selection
                                            setSelectedIds(new Set());
                                            selectedContext.current = track;
                                            showPopover(new DOMRect(e.clientX, e.clientY, 0, 0), <Menu items={singleItems} />, { id: 'context-menu' });
                                        }
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
