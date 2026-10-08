import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path: string) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="container">
        <Link to={token ? "/home" : "/"} className="nav-brand">
          ⚡ <span>ContractAI</span>
        </Link>

        {token ? (
          <>
            <div className="nav-links">
              <Link to="/home"      className={isActive("/home")}>Dashboard</Link>
              <Link to="/summarize" className={isActive("/summarize")}>Analyze</Link>
              <Link to="/create"    className={isActive("/create")}>Create</Link>
              <Link to="/history"   className={isActive("/history")}>History</Link>
            </div>
            <div className="nav-actions">
              <button onClick={logout} className="btn btn-outline btn-sm">
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <div className="nav-actions">
            <Link to="/login"    className="btn btn-outline btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
