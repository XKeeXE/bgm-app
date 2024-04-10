import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from "@nextui-org/react";
import SettingsIcon from '@mui/icons-material/Settings';
import Languages from '../assets/languages.json';
import LanguageSelect from '../components/LanguageSelect';
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

const UISettings = (props: any) => {
    const {} = props;
    const [open, setOpen] = useState<boolean>(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
      };

    const DrawerList = (
        <Box sx={{ width: 250, backgroundColor: 'red' }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {/* {CONFIGS.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))} */}
		<ListItem disablePadding>
            <ListItemButton>
              {/* <ListItemText primary={<LanguageSelect/>} /> */}
            </ListItemButton>
          </ListItem>
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
      );

    return (
		// <Dropdown>
		// 		<DropdownTrigger>
		// 			{/* <Tooltip content={"settings"}> */}
		// 				<Button variant="light" size="lg" isIconOnly aria-label="settings" onClick={() => {
							
		// 				}}><SettingsIcon/>
		// 				</Button>
    //     			{/* </Tooltip> */}
		// 		</DropdownTrigger>

		// 		<DropdownMenu aria-label="Static Actions">
		// 			<DropdownItem key="new">New file</DropdownItem>
		// 			<DropdownItem key="copy">Copy link</DropdownItem>
		// 			<DropdownItem key="edit">Edit file</DropdownItem>
		// 			<DropdownItem key="delete" className="text-danger" color="danger">
		// 			Delete file
		// 			</DropdownItem>
		// 		</DropdownMenu>
		// </Dropdown>
	<div>
		<Tooltip content={"Settings"}>
			<Button variant="light" size="lg" isIconOnly aria-label="settings" onClick={toggleDrawer(true)}>
				<SettingsIcon/>
			</Button>
		</Tooltip>
		<Drawer open={open} onClose={toggleDrawer(false)}>
			{DrawerList}
		</Drawer>
    </div>
    )
}

export default UISettings;