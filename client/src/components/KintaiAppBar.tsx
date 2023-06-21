import {
  AppBar,
  Drawer,
  IconButton,
  Link as MuiLink,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { blue } from "@mui/material/colors";
import { useState } from "react";
import { Link } from "react-router-dom";

type DrawerItemProps = {
  href: string;
  text: string;
};
function DrawerItem({ href, text }: DrawerItemProps): JSX.Element {
  return <Link to={href}>{text}</Link>;
}

function KintaiAppBar(): JSX.Element {
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);

  return (
    <AppBar position="sticky">
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
            <ListItem>
              <DrawerItem href="/week" text="week" />
            </ListItem>
          </List>
        </Drawer>
        <MuiLink href="/">
          <Typography variant="h5" color={blue[50]}>
            Kintai
            {process.env.REACT_APP_IS_DEVELOPMENT ? (
              <span>開発環境！！！</span>
            ) : null}
          </Typography>
        </MuiLink>
      </Toolbar>
    </AppBar>
  );
}

export default KintaiAppBar;
