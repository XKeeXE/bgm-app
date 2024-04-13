import * as React from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents, Virtuoso } from 'react-virtuoso';
import UIContextMenu from './UIContextMenu';
import { useEffect, useRef, useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getKeyValue, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { useAsyncList } from '@react-stately/data';

const BGMTableList = (props: any) => {
    const { tracks, bgm, virtuosoRef, forceUpdate, setForceUpdate, playedTracks, selectedTrack, CheckTrackType, PlayTrack } = props;
    const selectedContext = useRef<number>(0);
    const contextTrack = useRef<string>('');

	const [isLoading, setIsLoading] = useState(true);

    interface Data {
        id: number;
        title: string;
        duration: number;
        played: boolean;
    }
    
    interface ColumnData {
        width: number;
        label: string;
        dataKey: keyof Data;
        // played: boolean
    }
    
    function createData(
        id: number,
        title: string,
        duration: number,
        played: boolean,
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
    ];
    
    const rows: Data[] = Array.from(tracks.current, (_, index) => {
      return createData(index, CheckTrackType(tracks.current[index]), bgm.current[index].duration, bgm.current[index].played.toString());
    });

	let list = useAsyncList({
		async load({signal, cursor}) {
	
		  if (cursor) {
			setIsLoading(false);
		  }
	
		  // If no cursor is available, then we're loading the first page.
		  // Otherwise, the cursor is the next URL to load, as returned from the previous page.
		  const res = await fetch(cursor || 'https://swapi.py4e.com/api/people/?search=', {signal});
		  let json = await res.json();
	
		  return {
			items: json.results,
			cursor: json.next,
		  };
		},
	  });
    
    // const VirtuosoTableComponents: TableComponents<Data> = {
    //   Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    //     <TableContainer component={Paper} {...props} ref={ref} />
    //   )),
    //   Table: (props) => (
    //     <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    //   ),
    //   TableHead,
    //   TableRow: ({ item: _item, ...props }) => <TableRow hover {...props} />,
    //   TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    //     <TableBody {...props} ref={ref} />
    //   )),
    // };
    
    // function fixedHeaderContent() {
    //   return (
    //     <TableRow>
    //       {columns.map((column) => (
    //         <TableCell
    //           key={column.dataKey}
    //           variant="head"
    //         //   align={column.numeric || false ? 'right' : 'left'}
    //           style={{ width: column.width }}
    //           sx={{
    //             backgroundColor: 'background.paper',
    //           }}
    //         >
    //           {column.label}
    //         </TableCell>
    //       ))}
    //     </TableRow>
    //   );
    // }
    
    // function rowContent(index: number, row: Data) {
    //   return (
    //     <>
    //       {columns.map((column) => (
    //         <TableCell
    //             key={column.dataKey}
    //             onClick={() => {
    //                 PlayTrack(index);
    //             }}
    //             onContextMenu={() => {
    //                 selectedContext.current = index;
    //                 contextTrack.current = CheckTrackType(tracks.current[index]);
    //             }}>
    //             {row[column.dataKey]}
    //         </TableCell>
    //       ))}
    //     </>
    //   );
    // }
    // return (
    //     <UIContextMenu tracks={tracks} bgm={bgm} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} playedTracks={playedTracks} selectedTrack={selectedTrack} selectedContext={selectedContext} contextTrack={contextTrack}>
    //         <Paper style={{ height: 400, width: '100%' }}>
    //             <TableVirtuoso
    //                 ref={virtuosoRef}
    //                 data={rows}
    //                 components={VirtuosoTableComponents}
    //                 fixedHeaderContent={fixedHeaderContent}
    //                 itemContent={rowContent}/>
    //         </Paper>
    //     </UIContextMenu>
    // )

	return (
		<Table aria-label="Example static collection table">
      		<TableHeader>
        		{columns.map((column) => 
					<TableColumn key={column.dataKey}>{column.dataKey}</TableColumn>
				)}
      		</TableHeader>
      	<TableBody 
			isLoading={isLoading}
			items={list.items}
			loadingContent={<Spinner color="white" />}>
	  		{rows.map((row) => (
            	<TableRow key={row.id} onClick={() => {
                    	PlayTrack(row.id);
               		}}
                	onContextMenu={() => {
                    	selectedContext.current = row.id;
                    	contextTrack.current = CheckTrackType(tracks.current[row.id]);
                	}}>
						{(columnKey) => <TableCell>{getKeyValue(row, columnKey)}</TableCell>}
            	</TableRow>
          	))}
      </TableBody>
    </Table>
	)
}

export default BGMTableList;