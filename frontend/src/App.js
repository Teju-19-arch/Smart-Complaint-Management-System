import React, { useState, useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { getToken, clearToken, getMe } from "./api";

function App() {

  /* user = { id, name, email, role } or null */
  const [user, setUser] = useState(null);

  /* "login" | "register" */
  const [view, setView] = useState("login");
  const [notice, setNotice] = useState("");

  /* If a token is saved, restore the session before showing anything */
  const [checking, setChecking] = useState(!!getToken());

  useEffect(() => {

    if (!getToken()) return;

    getMe()
      .then((res) => setUser(res.data.user))
      .catch(() => clearToken())
      .finally(() => setChecking(false));

  }, []);

  const logout = () => {
    clearToken();
    setUser(null);
    setView("login");
    setNotice("");
  };

  if (checking) {
    return null;
  }

  /* Show login / register page */

  if (!user) {

    if (view === "register") {
      return (
        <Register
          goToLogin={() => setView("login")}
          onRegistered={() => {
            setNotice("Account created! Please log in.");
            setView("login");
          }}
        />
      );
    }

    return (
      <Login
        onLogin={(u) => { setNotice(""); setUser(u); }}
        goToRegister={() => { setNotice(""); setView("register"); }}
        notice={notice}
      />
    );
  }

  const logoutButton = (
    <button
      onClick={logout}
      style={{
        position: "fixed",
        top: "12px",
        right: "12px",
        zIndex: 1000,
        padding: "8px 14px",
        borderRadius: "6px",
        border: "none",
        background: "linear-gradient(135deg,#667eea,#764ba2)",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      Logout
    </button>
  );

  /* Admin dashboard */

  if (user.role === "admin") {
    return <>{logoutButton}<AdminDashboard /></>;
  }

  /* Student dashboard */

  return <>{logoutButton}<StudentDashboard /></>;

}

export default App;
