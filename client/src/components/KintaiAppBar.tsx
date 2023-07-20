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
import { Link as Link2 } from "react-router-dom";
import { blue } from "@mui/material/colors";
import { useState } from "react";

type DrawerItemProps = {
  href: string;
  text: string;
  onClick: () => void;
};

function DrawerItem({ href, text, onClick }: DrawerItemProps): JSX.Element {
  return (
    <Link2 onClick={onClick} to={href}>
      {text}
    </Link2>
  );
}

function KintaiAppBar(): JSX.Element {
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);

  const closeDrawer = () => {
    setIsOpenDrawer(false);
  };

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
              <DrawerItem onClick={closeDrawer} href="/" text="home" />
            </ListItem>
            <ListItem>
              <DrawerItem onClick={closeDrawer} href="/deals" text="deals" />
            </ListItem>
            <ListItem>
              <DrawerItem onClick={closeDrawer} href="/week" text="week" />
            </ListItem>
          </List>
        </Drawer>
        <Link href="/">
          <Typography variant="h5" color={blue[50]}>
            Kintai
            {process.env.REACT_APP_IS_DEVELOPMENT ? (
              <span>開発環境！！！</span>
            ) : null}
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default KintaiAppBar;
