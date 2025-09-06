import React, { useState} from "react";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  // Use a state variable to control the page being displayed
  const [page, setPage] = useState("login"); 
  
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
      {page === "login" ? (
        <Login onLogin={handleLogin} onSwitchToRegister={() => setPage("register")} />
      ) : page === "register" ? (
        <Register onSwitchToLogin={() => setPage("login")} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
