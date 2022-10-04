import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Clients from "./Clients";
import Home from "./Home";
import WorkHours from "./WorkHours";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <header>
          <Link to="/">home</Link>
          <Link to="/clients">clients</Link>
          <Link to="/">deals</Link>
        </header>
        <div className="app-root">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/workHours" element={<WorkHours />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
