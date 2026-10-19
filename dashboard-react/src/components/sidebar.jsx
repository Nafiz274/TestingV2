import "./sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>My Dashboard</h2>

      <nav>
        <a href="#">Dashboard</a>
        <a href="#">Profile</a>
        <a href="#">Settings</a>
        <a href="#">Logout</a>
      </nav>
    </aside>
  );
}

export default Sidebar;
