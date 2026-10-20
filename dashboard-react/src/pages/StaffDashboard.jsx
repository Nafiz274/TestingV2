import "../App.css";
import Sidebar from "../components/sidebar";
import DashboardCard from "../components/DashboardCard";
import { useState } from "react";

function StaffDashboard() {
  const [tasksCompleted, setTasksCompleted] = useState(24);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="dashboard">
        <h1>Staff Dashboard</h1>
        <p>Welcome to VolunteerHub! Manage your volunteers and activities.</p>

        <div className="dashboard-cards">
          <DashboardCard title="Total Volunteers" value="150" />
          <DashboardCard title="Upcoming Events" value="8" />
          <DashboardCard title="Tasks Completed" value={tasksCompleted} />
        </div>

        <button onClick={() => setTasksCompleted(tasksCompleted + 1)}>
          Complete Task
        </button>

        <button onClick={() => setTasksCompleted(0)}>Reset Tasks</button>
      </main>
    </div>
  );
}

export default StaffDashboard;
