// src/components/Layout.jsx

import { Outlet, Link } from 'react-router-dom';
import './Layout.css';

function Layout() {
  return (
    <div className="layout">
      <div className="header-container">
        <img src="/no mans sky header.png" alt="NMS Recipes Header" className="header-image" />
        <h1 className="header-title">No Man&apos;s Sky Ingestor Buffs</h1>
      </div>

      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/manage-categories">Manage Categories</Link>
          </li>
          <li>
            <Link to="/manage-buffs">Manage Buffs</Link>
          </li>
          <li>
            <Link to="/manage-items">Manage Items</Link>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <span className="copyright">©2025 David Snyder</span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
