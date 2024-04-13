import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Switch, Tooltip } from "@nextui-org/react";
import SettingsIcon from '@mui/icons-material/Settings';
import Languages from '../assets/languages.json';
import LanguageSelect from '../components/LanguageSelect';
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

const UISettings = (props: any) => {
    const {} = props;
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
		<Dropdown closeOnSelect={false} showArrow>
				<DropdownTrigger>
					{/* <Tooltip content={"settings"}> */}
						<Button variant="light" size="lg" isIconOnly aria-label="settings" onClick={() => {
							
						}}><SettingsIcon/>
						</Button>
        			{/* </Tooltip> */}
				</DropdownTrigger>

				<DropdownMenu aria-label="Static Actions">
					<DropdownItem key="new">New file</DropdownItem>
					{/* <DropdownItem key="copy">Copy link</DropdownItem> */}
					<DropdownItem key="edit"><Switch defaultSelected aria-label="Automatic updates"/></DropdownItem>
				</DropdownMenu>
		</Dropdown>
        {/* <Tooltip content={"Settings"}>
            <Button variant="light" size="lg" isIconOnly aria-label="settings" onClick={toggleDrawer(true)}>
                <SettingsIcon/>
            </Button>
        </Tooltip>
         */}
        </>
    )
}

export default UISettings;