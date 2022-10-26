import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Clients from "./Clients";
import Deals from "./Deals";
import Home from "./Home";
import WorkHours from "./WorkHours";

import Style from "./App.module.css";
import Header from "./Header";
import ErrorBoundary from "./ErrorBoundary";
import DeletedWorkHours from "./DeletedWorkHours";
import { parseQuery } from "../utils";

const AppBody = () => {
  const query = parseQuery(useLocation().search);

  return (
    <div className={Style.appRoot}>
      <ErrorBoundary>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/workHours" element={<WorkHours />} />
          <Route path="/deals" element={<Deals clientId={query.clientId} />} />
          <Route path="/deletedWorkHours" element={<DeletedWorkHours />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <AppBody />
      </BrowserRouter>
    </div>
  );
};

export default App;
