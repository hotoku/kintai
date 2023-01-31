import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ClientsPage from "./ClientsPage";
import Deals from "./DealsPage";

import ErrorBoundary from "./ErrorBoundary";
import { parseQuery } from "../utils";
import { Box } from "@mui/material";
import WorkHoursPage from "./WorkHoursPage";
import KintaiAppBar from "./KintaiAppBar";
import WeekPage from "./WeekPage";
import dayjs from "dayjs";

function MyRoutes() {
  const query = parseQuery(useLocation().search);
  const date = query.week ?? dayjs().format("YYYY-MM-DD");

  return (
    <Routes>
      <Route index element={<ClientsPage />} />,
      <Route
        path="/workHours"
        element={<WorkHoursPage dealId={parseInt(query.dealId)} />}
      />
      ,
      <Route path="/deals" element={<Deals clientId={query.clientId} />} />,
      <Route path="/week" element={<WeekPage date={date} key={date} />} />
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
