//frontend/src/App.jsx


import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/FloodDashboard"
import Home from "./pages/Home"
import Products from "./pages/Products"
import Register from "./pages/Register"
import Login from "./pages/Login.jsx"
import ProtectedRoute from "./routes/ProtectedRoute.jsx"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }
        />

        <Route path="/claims" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }
        />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }
        />

      </Routes>    
    </BrowserRouter>
  );
}
