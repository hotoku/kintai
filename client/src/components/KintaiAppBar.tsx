import {
  AppBar,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { blue } from "@mui/material/colors";
import { useState } from "react";

type DrawerItemProps = {
  href: string;
  text: string;
};
function DrawerItem({ href, text }: DrawerItemProps): JSX.Element {
  return <Link href={href}>{text}</Link>;
}

function KintaiAppBar(): JSX.Element {
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large" onClick={() => setIsOpenDrawer((x) => !x)}>
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="left"
          open={isOpenDrawer}
          onClose={() => setIsOpenDrawer((x) => !x)}
        >
          <List>
            <ListItem>
              <DrawerItem href="/" text="home" />
            </ListItem>
            <ListItem>
              <DrawerItem href="/deals" text="deals" />
            </ListItem>
          </List>
        </Drawer>
        <Link href="/">
          <Typography variant="h5" color={blue[50]}>
            Kintai
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default KintaiAppBar;
