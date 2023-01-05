import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function KintaiAppBar(): JSX.Element {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large">
          <MenuIcon />
        </IconButton>
        <Button variant="text">
          <Typography variant="h5">Kintai</Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default KintaiAppBar;
