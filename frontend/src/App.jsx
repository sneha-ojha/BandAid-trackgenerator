import React, { useState } from "react";
import HomePage from "./Home";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  // Use a state variable to control the page being displayed.
  // We'll set the initial state to "home" so it's the first page loaded.
  const [page, setPage] = useState("home"); 

  // This function is called on successful login
  const handleLogin = () => {
    // Navigate to the Dashboard page
    setPage("dashboard");
  };

  // This function is called on logout
  const handleLogout = () => {
    // Navigate back to the Login page
    setPage("login");
  };

  return (
    <div>
      {page === "home" ? (
        <HomePage onSwitchToLogin={() => setPage("login")} onSwitchToRegister={() => setPage("register")} />
      ) : page === "login" ? (
        <Login onLogin={handleLogin} onSwitchToRegister={() => setPage("register")} onSwitchToHome={() => setPage("home")} />
      ) : page === "register" ? (
        <Register onSwitchToLogin={() => setPage("login")} onSwitchToHome={() => setPage("home")} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
