import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import "./App.scss";
import Home from "./pages/Home";
import Rewards from "./pages/Rewards";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/rewards" element={<Rewards />} />
      </Routes>
    </>
  );
}

export default App;
