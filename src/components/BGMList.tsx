import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { FixedSizeList, ListChildComponentProps } from 'react-window';

let test: string | any[] = [];

const Row = (props: ListChildComponentProps) => {
    const { style, index } = props;
    return (
        <ListItem style={style} key={index}>
            <ListItemButton onClick={() => {
                console.log(test[index]);
            }}>
                <ListItemText primary={test[index]}/>
            </ListItemButton>
        </ListItem>
    );
}

const BGMList = (props: any) => {
    const { tracks } = props;
    test = tracks.current;
    return (
        <FixedSizeList
        height={400}
        width={360}
        itemSize={100}
        itemCount={test.length}
        overscanCount={5}>
            {Row}
        </FixedSizeList>
    )
}

export default BGMList;