import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TaskManager from './components/TaskManagement/TaskManagement';
import UserManager from './components/UserManagement/UserManagement';
import './App.css';

function App() {
  const [sortBy, setSortBy] = useState('deadline');

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Task Manager App</Link>
            <div className="navbar-nav">
              <Link className="nav-link" to="/tasks">Quản lý Nhiệm vụ</Link>
              <Link className="nav-link" to="/users">Quản lý Người dùng</Link>
            </div>
          </div>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/tasks" element={<TaskManager sortBy={sortBy} setSortBy={setSortBy} />} />
            <Route path="/users" element={<UserManager />} />
            <Route path="/" element={<TaskManager sortBy={sortBy} setSortBy={setSortBy} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;