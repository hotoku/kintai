import {
  AppBar,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { blue } from "@mui/material/colors";

function KintaiAppBar(): JSX.Element {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large">
          <MenuIcon />
        </IconButton>
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
