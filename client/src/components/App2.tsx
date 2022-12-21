import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ClientsPage from "./ClientsPage";
import Deals from "./Deals";
import Home from "./Home";
import WorkHours from "./WorkHours";

import Style from "./App.module.css";
import ErrorBoundary from "./ErrorBoundary";
import DeletedWorkHours from "./DeletedWorkHours";
import { parseQuery } from "../utils";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WorkHoursPage from "./WorkHoursPage";

function MyRoutes() {
  const query = parseQuery(useLocation().search);

  return (
    <Routes>
      <Route index element={<ClientsPage />} />,
      <Route
        path="/workHours"
        element={<WorkHoursPage dealId={parseInt(query.dealId)} />}
      />
      ,
      <Route path="/deals" element={<Deals clientId={query.clientId} />} />,
      <Route path="/deletedWorkHours" element={<DeletedWorkHours />} />,
    </Routes>
  );
}
const App = () => {
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
          <MyRoutes />
        </BrowserRouter>
      </Box>
    </ErrorBoundary>
  );
};

export default App;
