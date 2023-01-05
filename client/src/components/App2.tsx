import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ClientsPage from "./ClientsPage";
import Deals from "./Deals";

import ErrorBoundary from "./ErrorBoundary";
import DeletedWorkHours from "./DeletedWorkHours";
import { parseQuery } from "../utils";
import { Box } from "@mui/material";
import WorkHoursPage from "./WorkHoursPage";
import KintaiAppBar from "./AppBar";

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
        <KintaiAppBar />
        <BrowserRouter>
          <MyRoutes />
        </BrowserRouter>
      </Box>
    </ErrorBoundary>
  );
};

export default App;
