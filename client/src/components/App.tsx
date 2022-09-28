import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Deals from "./Deals";
import WorkHours from "./WorkHours";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Deals />} />
        <Route path="/deal/:id" element={<WorkHours />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
