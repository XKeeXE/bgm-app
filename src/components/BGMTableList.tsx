import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents, Virtuoso } from 'react-virtuoso';
import UIContextMenu from './UIContextMenu';
import { useEffect, useRef } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';

const BGMTableList = (props: any) => {
    const { tracks, bgm, virtuosoRef, forceUpdate, setForceUpdate, playedTracks, selectedTrack, CheckTrackType, PlayTrack } = props;
    const selectedContext = useRef<number>(0);
    const contextTrack = useRef<string>('');

    interface Data {
        id: number;
        title: string;
        duration: number;
        played: boolean;
    //   dessert: string;
    //   fat: number;
    //   protein: number;
    }
    
    interface ColumnData {
        width: number;
        label: string;
        dataKey: keyof Data;
        // played: boolean
    }
    
    type Sample = [string, number, number, number, number];
    
    const sample: readonly Sample[] = [
    //   ['Frozen yoghurt', 159, 6.0, 24, 4.0],
    //   ['Ice cream sandwich', 237, 9.0, 37, 4.3],
    //   ['Eclair', 262, 16.0, 24, 6.0],
    //   ['Cupcake', 305, 3.7, 67, 4.3],
    //   ['Gingerbread', 356, 16.0, 49, 3.9],
    ];
    
    function createData(
        id: number,
        title: string,
        duration: number,
        played: boolean,
    //   fat: number,
    //   carbs: number,
    //   protein: number,
    ): Data {
      return { id, title, duration, played };
    }
    
    const columns: ColumnData[] = [
      {
        width: 0,
        label: '#',
        dataKey: 'id',
      },
      {
        width: 200,
        label: 'Title',
        dataKey: 'title',
      },
      {
        width: 120,
        label: 'Duration',
        dataKey: 'duration',
      },
    
      {
        width: 120,
        label: 'Played',
        dataKey: 'played',
      },
    //   {
    //     width: 120,
    //     label: 'Carbs\u00A0(g)',
    //     dataKey: 'carbs',
    //     numeric: true,
    //   },
    //   {
    //     width: 120,
    //     label: 'Protein\u00A0(g)',
    //     dataKey: 'protein',
    //     numeric: true,
    //   },
    ];
    
    const rows: Data[] = Array.from(tracks.current, (_, index) => {
    //   const randomSelection = sample[Math.floor(Math.random() * sample.length)];
      return createData(index, CheckTrackType(tracks.current[index]), bgm.current[index].duration, bgm.current[index].played.toString());
    });
    
    const VirtuosoTableComponents: TableComponents<Data> = {
      Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} />
      )),
      Table: (props) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
      ),
      TableHead,
      TableRow: ({ item: _item, ...props }) => <TableRow hover {...props} />,
      TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref} />
      )),
    };
    
    function fixedHeaderContent() {
      return (
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.dataKey}
              variant="head"
            //   align={column.numeric || false ? 'right' : 'left'}
              style={{ width: column.width }}
              sx={{
                backgroundColor: 'background.paper',
              }}
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      );
    }
    
    function rowContent(index: number, row: Data) {
      return (
        <>
          {columns.map((column) => (
            <TableCell
                key={column.dataKey}
                onClick={() => {
                    PlayTrack(index);
                }}
                onContextMenu={() => {
                    selectedContext.current = index;
                    contextTrack.current = CheckTrackType(tracks.current[index]);
                }}>
                {row[column.dataKey]}
            </TableCell>
          ))}
        </>
      );
    }
    return (
        <UIContextMenu tracks={tracks} bgm={bgm} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} playedTracks={playedTracks} selectedTrack={selectedTrack} selectedContext={selectedContext} contextTrack={contextTrack}>
            <Paper style={{ height: 400, width: '100%' }}>
                <TableVirtuoso
                    ref={virtuosoRef}
                    data={rows}
                    components={VirtuosoTableComponents}
                    fixedHeaderContent={fixedHeaderContent}
                    itemContent={rowContent}/>
            </Paper>
        </UIContextMenu>
    )
}

export default BGMTableList;