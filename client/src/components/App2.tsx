import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Clients from "./Clients";
import Deals from "./Deals";
import Home from "./Home";
import WorkHours from "./WorkHours";

import Style from "./App.module.css";
import ErrorBoundary from "./ErrorBoundary";
import DeletedWorkHours from "./DeletedWorkHours";
import { parseQuery } from "../utils";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const AppBody = () => {
  const query = parseQuery(useLocation().search);

  return (
    <div className={Style.appRoot}>
      <ErrorBoundary>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/clients" element={<Clients />} />
          <Route
            path="/workHours"
            element={<WorkHours dealId={query.dealId} />}
          />
          <Route path="/deals" element={<Deals clientId={query.clientId} />} />
          <Route path="/deletedWorkHours" element={<DeletedWorkHours />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

const App = () => {
  // const query = parseQuery(useLocation().search);

  return (
    <ErrorBoundary>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton size="large">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Kintai
            </Typography>
          </Toolbar>
        </AppBar>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/workHours" element={<WorkHours />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/deletedWorkHours" element={<DeletedWorkHours />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ErrorBoundary>
  );
};

export default App;
