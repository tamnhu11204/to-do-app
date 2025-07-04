import { useEffect, useState } from 'react';

const users = ['Be An', 'Khang', 'Nhu', 'Lam'];

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskInput, setTaskInput] = useState('');
  const [deadline, setDeadline] = useState('');
  const [reminder, setReminder] = useState([]);
  const [assignedUser, setAssignedUser] = useState([]);
  const [sortBy, setSortBy] = useState('deadline');
  const [editingTaskId, setEditingTaskId] = useState(null);

  // add task into localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // reminder task which is about to expire
  useEffect(() => {
    const reminderTask = () => {
      const now = new Date();
      const nearDeadlineTasks = tasks.filter(task => {
        if (task.done) return false;
        const deadlineDate = new Date(task.deadline);
        const timeDiff = (deadlineDate - now) / (1000 * 60);
        return timeDiff > 0 && timeDiff <= 30;
      });
      if (nearDeadlineTasks.length > 0) {
        setReminder(nearDeadlineTasks);
        alert(`Reminder: ${nearDeadlineTasks.length} tasks are bout to expire!`);
      } else {
        setReminder([]);
      }
    };
    const interval = setInterval(reminderTask, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  // add and edit task
  const addNewTask = () => {
    if (!taskInput || !deadline) return;
    if (editingTaskId) {
      // edit task
      setTasks(tasks.map(task =>
        task.id === editingTaskId
          ? { ...task, text: taskInput, deadline, assignedUser }
          : task
      ));
      setEditingTaskId(null);
    } else {
      // add new task
      const newTask = {
        id: Date.now(),
        text: taskInput,
        deadline: deadline,
        assignedUser: assignedUser,
        done: false,
      };
      setTasks([...tasks, newTask]);
    }
    setTaskInput('');
    setDeadline('');
    setAssignedUser(users[0]);
  };

  // edit task
  const editTask = (task) => {
    setEditingTaskId(task.id);
    setTaskInput(task.text);
    setDeadline(task.deadline);
    setAssignedUser(task.assignedUser);
  };

  // delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // check completed or not completed
  const toggleTaskDone = (id) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, done: !task.done } : task)));
  };

  // check deadline
  const isExpired = (deadline, done) => {
    return new Date(deadline) < new Date() && !done;
  };

  // divide the list into active and expired items
  const activeTasks = [...tasks]
    .filter(task => !isExpired(task.deadline, task.done))
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline) - new Date(b.deadline);
      } else {
        return a.assignedUser.localeCompare(b.assignedUser);
      }
    });

  const expiredTasks = [...tasks]
    .filter(task => isExpired(task.deadline, task.done))
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline) - new Date(b.deadline);
      } else {
        return a.assignedUser.localeCompare(b.assignedUser);
      }
    });

  return (
    <div className="container my-4">
      <div className="card">
        <div className="card-header">
          <h1 className="text-center fw-bold">TO DO APP</h1>
        </div>

        <div className="card-body">
          {/* Form add task  */}
          <div className="row mb-3">
            <div className="col-2">
              <label className="form-label fw-bold">Task</label>
            </div>
            <div className="col-10">
              <input
                className="form-control"
                type="text"
                placeholder="Enter task..."
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-2">
              <label className="form-label fw-bold">Deadline</label>
            </div>
            <div className="col-10">
              <input
                className="form-control"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-2">
              <label className="form-label fw-bold">Doing by</label>
            </div>
            <div className="col-10">
              <select
                className="form-select"
                value={assignedUser}
                onChange={(e) => setAssignedUser(e.target.value)}
              >
                <option selected>Choose user who will do this task...</option>
                {users.map(user => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-success mb-3"
            onClick={addNewTask}
          >
            Add new task
          </button>

          <h3 className="text-center fw-bold mb-3">To do list</h3>

          <div className="row mb-3">
            <div className="col-2">
              <label className="form-label fw-bold">Sort by</label>
            </div>
            <div className="col-10">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="deadline">Deadline</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          {/* List active tasks */}
          <h4 className="fw-bold mb-2">Active Tasks</h4>
          <ul className="list-group mb-4">
            {activeTasks.length > 0 ? (
              activeTasks.map(task => (
                <li
                  key={task.id}
                  className="list-group-item d-flex align-items-center"
                >
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={task.done}
                    onChange={() => toggleTaskDone(task.id)}
                  />
                  <span className={task.done ? 'text-decoration-line-through' : ''}>
                    {task.text}
                  </span>
                  <div className="ms-3 text-muted small">
                    Deadline: {new Date(task.deadline).toLocaleString('vi-VN')}
                  </div>
                  <div className="ms-3 text-muted small">
                    Doing by: {task.assignedUser}
                  </div>
                  <div className="ms-auto">
                    <button
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editTask(task)}
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteTask(task.id)}
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">No active tasks</li>
            )}
          </ul>

          {/* List expired tasks */}
          <h4 className="fw-bold mb-2">Expired Tasks</h4>
          <ul className="list-group mb-4">
            {expiredTasks.length > 0 ? (
              expiredTasks.map(task => (
                <li
                  key={task.id}
                  className="list-group-item d-flex align-items-center bg-danger-subtle"
                >
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={task.done}
                    onChange={() => toggleTaskDone(task.id)}
                  />
                  <span className={task.done ? 'text-decoration-line-through' : ''}>
                    {task.text}
                  </span>
                  <div className="ms-3 text-muted small">
                    Deadline: {new Date(task.deadline).toLocaleString('vi-VN')}
                  </div>
                  <div className="ms-3 text-muted small">
                    Doing by: {task.assignedUser}
                  </div>
                  <div className="ms-auto">
                    <button
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editTask(task)}
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteTask(task.id)}
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">No expired tasks</li>
            )}
          </ul>

          {/* reminder */}
          {reminder.length > 0 && (
            <div className="mt-3 p-2 bg-warning-subtle rounded">
              <h3 className="fw-bold">Tasks is about to expire:</h3>
              <ul className="list-unstyled">
                {reminder.map(task => (
                  <li key={task.id}>
                    {task.text} - Deadline: {new Date(task.deadline).toLocaleString('vi-VN')}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;