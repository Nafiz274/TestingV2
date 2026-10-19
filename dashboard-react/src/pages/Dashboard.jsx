import "../App.css";
import Sidebar from "../components/sidebar";
import DashboardCard from "../components/DashboardCard";
import { useState } from "react";

function Dashboard() {
  const [tasksCompleted, setTasksCompleted] = useState(24);
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="dashboard">
        <h1>Welcome to your Dashboard!</h1>
        <p>This is my first React dashboard.</p>
        <button>View Profile</button>

        <div className="dashboard-cards">
          <DashboardCard title="Total Users" value="150" />
          <DashboardCard title="Active Projects" value="8" />
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

export default Dashboard;
