import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import WorkHours from "./WorkHours";

const App = () => {
  return (
    <div>
      <header>
        <a href="/">home</a>
      </header>
      <div className="app-root">
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/workHours" element={<WorkHours />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
