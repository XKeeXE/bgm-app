import UIContextMenu from './UIContextMenu';
import { useRef, useState } from 'react';

import NumbersIcon from '@mui/icons-material/Numbers';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

import CheckBoxBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxTrueIcon from '@mui/icons-material/CheckBox';

const BGMTableList = (props: any) => {
    const { tracks, bgm, tableRef, rowRef, currentTrackTitle, forceUpdate, setForceUpdate, playedTracks, selectedTrack, CheckTrackType, PlayTrack, TranslateTrackToBGM } = props;
    const selectedContext = useRef<number>(0);
    const contextTrack = useRef<string>('');

    const [hideColumns, setHideColumns] = useState<boolean[]>([false, false, false, false]);

    const updatedHideColumns = hideColumns.map((value, index) => {
        if (index === 2) {
          return true;
        } else {
          return value;
        }
      });

    interface Data {
        id: number;
        title: string;
        duration: number;
        played: JSX.Element;
    }
    
    interface ColumnData {
        width: number;
        label: string | JSX.Element;
        dataKey: keyof Data;
    }
    
    function createData(
        id: number,
        title: string,
        duration: number,
        played: JSX.Element,
    ): Data {
      return { id, title, duration, played };
    }
    
    const columns: ColumnData[] = [
      {
        width: 5,
        label: <NumbersIcon/>,
        dataKey: 'id',
      },
      {
        width: 400,
        label: 'TITLE',
        dataKey: 'title',
      },
      {
        width: 120,
        label: <AccessTimeIcon/>,
        dataKey: 'duration',
      },
    
      {
        width: 120,
        label: <PlaylistAddCheckIcon/>,
        dataKey: 'played',
      },
    ];
    
    const rows: Data[] = Array.from(tracks.current, (_, index) => {
        return createData(index, CheckTrackType(tracks.current[index]), TranslateTrackToBGM(index).duration, TranslateTrackToBGM(index).played ? <CheckBoxTrueIcon/> : <CheckBoxBlankIcon/>);
    });

	return (
        <div className=' overflow-hidden h-[80vh] md:h-[82vh] lg:h-[85vh] overflow-y-auto select-none'>
            <UIContextMenu tracks={tracks} bgm={bgm} currentTrackTitle={currentTrackTitle} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} playedTracks={playedTracks} 
            PlayTrack={PlayTrack} selectedTrack={selectedTrack} selectedContext={selectedContext} contextTrack={contextTrack} TranslateTrackToBGM={TranslateTrackToBGM}>
                <table ref={tableRef} className='table-fixed'>
                    {/* <colgroup>
                        {columns.map(column => (
                            <col style={{
                                maxWidth: column.width + 'px',
                                width: column.width + 'px'
                                
                            }}/>
                        ))}
                    </colgroup> */}
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={column.dataKey} onClick={() => {
                                    console.log(index);
                                }} style={{
                                    // visibility: 'hidden',
                                }}>
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr key={row.id} className='hover:bg-background/40 border-b-1 border-gray-600 first:border-t-1 last:border-0' id={`row-${row.id}`} ref={(element) => rowRef.current[row.id] = element} onClick={() => {
                                PlayTrack(row.id);
                            }} onContextMenu={() => {
                                console.log(row.id);
                                selectedContext.current = row.id;
                                contextTrack.current = CheckTrackType(tracks.current[row.id]);
                            }}>
                                <td className='text-xs text-center' style={{
                                    // display: hideColumns[0] ? '' : 'none'
                                    // visibility: hideColumns[1] ? 'visible' : 'hidden'
                                }}>
                                    {row.id}
                                </td>
                                <td className='text-xs text-ellipsis overflow-hidden whitespace-nowrap max-w-[300px] md:max-w-[300px] lg:max-w-[400px] xl:max-w-[600px]' style={{
                                    // visibility: hideColumns[1] ? 'hidden' : 'visible'
                                }}>
                                    {row.title}
                                </td>
                                <td>
                                    {row.duration}
                                </td>
                                <td>
                                    {row.played}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </UIContextMenu>
        </div>
	)
}

export default BGMTableList;