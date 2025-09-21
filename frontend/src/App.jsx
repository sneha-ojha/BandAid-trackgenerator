import React, { useState } from "react";

import HomePage from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // fixed path

function App() {
  const [page, setPage] = useState("home");

  // Called on successful login
  const handleLogin = () => {
    setPage("dashboard");
  };

  // Called on logout
  const handleLogout = () => {
    setPage("login");
  };

  return (
    <div>
      {page === "home" ? (
        <HomePage
          onSwitchToLogin={() => setPage("login")}
          onSwitchToRegister={() => setPage("register")}
        />
      ) : page === "login" ? (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setPage("register")}
          onSwitchToHome={() => setPage("home")}
        />
      ) : page === "register" ? (
        <Register
          onSwitchToLogin={() => setPage("login")}
          onSwitchToHome={() => setPage("home")}
        />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
