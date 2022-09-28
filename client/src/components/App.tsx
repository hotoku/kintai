import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import WorkHours from "./WorkHours";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/deal/:id" element={<WorkHours />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
