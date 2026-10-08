import React, { ReactElement } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Landing       from "./pages/Landing";
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import Home          from "./pages/Home";
import Summarize     from "./pages/Summarize";
import CreateContract from "./pages/CreateContract";
import History       from "./pages/History";

function ProtectedRoute({ element }: { element: ReactElement }): ReactElement {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/home"      element={<ProtectedRoute element={<Home />} />} />
        <Route path="/summarize" element={<ProtectedRoute element={<Summarize />} />} />
        <Route path="/create"    element={<ProtectedRoute element={<CreateContract />} />} />
        <Route path="/history"   element={<ProtectedRoute element={<History />} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
