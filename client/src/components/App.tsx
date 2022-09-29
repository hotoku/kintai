import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import WorkHours from "./WorkHours";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/workHours" element={<WorkHours />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
