import React, { useState } from "react";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {

  const [user, setUser] = useState(null);

  /* Show login page */

  if (!user) {
    return <Login setUser={setUser} />;
  }

  /* Student dashboard */

  if (user === "student") {
    return <StudentDashboard />;
  }

  /* Admin dashboard */

  if (user === "admin") {
    return <AdminDashboard />;
  }

}

export default App;