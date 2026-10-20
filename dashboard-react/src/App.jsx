import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/StaffDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/staff/dashboard" element={<Dashboard />} />

        <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
