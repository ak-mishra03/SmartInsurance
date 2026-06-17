//frontend/src/App.jsx


import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/FloodDashboard"
import Home from "./pages/Home"
import Products from "./pages/Products"
import Signup from "./pages/Signup"
import Login from "./pages/Login.jsx"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>    
    </BrowserRouter>
  );
}
