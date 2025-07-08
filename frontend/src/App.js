import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TaskManager from './components/TaskManagement/TaskManagement';
import UserManager from './components/UserManagement/UserManagement';
import './App.css';

function App() {
  const [sortBy, setSortBy] = useState('deadline');

  return (
    <Router>
      <div class="app-container">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="container-fluid">
            <Link class="navbar-brand" to="/">Task Manager App</Link>
            <div class="navbar-nav">
              <Link class="nav-link" to="/tasks">Task management</Link>
              <Link class="nav-link" to="/users">User management</Link>
            </div>
          </div>
        </nav>

        <div class="content">
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