import { useState, useEffect } from 'react';

const users = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'];

const App = () => {
  const [tasks, setTasks] = useState(() => {
    // Lấy dữ liệu từ localStorage khi khởi động
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskInput, setTaskInput] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedUser, setAssignedUser] = useState(users[0]);
  const [sortBy, setSortBy] = useState('deadline');
  const [reminders, setReminders] = useState([]);

  // Lưu tasks vào localStorage mỗi khi tasks thay đổi
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Kiểm tra nhắc nhở nhiệm vụ gần hạn
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const nearDeadlineTasks = tasks.filter(task => {
        if (task.done) return false;
        const deadlineDate = new Date(task.deadline);
        const timeDiff = (deadlineDate - now) / (1000 * 60);
        return timeDiff > 0 && timeDiff <= 30;
      });
      if (nearDeadlineTasks.length > 0) {
        setReminders(nearDeadlineTasks);
        alert(`Nhắc nhở: ${nearDeadlineTasks.length} nhiệm vụ sắp đến hạn!`);
      } else {
        setReminders([]);
      }
    };
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  // Thêm nhiệm vụ mới
  const addTask = () => {
    if (!taskInput || !deadline) return;
    const newTask = {
      id: Date.now(),
      text: taskInput,
      deadline: deadline,
      assignedUser: assignedUser,
      done: false,
    };
    setTasks([...tasks, newTask]);
    setTaskInput('');
    setDeadline('');
  };

  // Đánh dấu hoàn thành/hoãn nhiệm vụ
  const toggleTaskDone = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  // Sắp xếp danh sách
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.deadline) - new Date(b.deadline);
    } else {
      return a.assignedUser.localeCompare(b.assignedUser);
    }
  });

  // Kiểm tra nhiệm vụ quá hạn
  const isOverdue = (deadline, done) => {
    return new Date(deadline) < new Date() && !done;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh Sách Nhiệm Vụ</h1>

      {/* Form thêm nhiệm vụ */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Nhập nhiệm vụ"
          className="border p-2 rounded flex-1"
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={assignedUser}
          onChange={(e) => setAssignedUser(e.target.value)}
          className="border p-2 rounded"
        >
          {users.map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
        <button
          onClick={addTask}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Thêm
        </button>
      </div>

      {/* Sắp xếp */}
      <div className="mb-4">
        <label className="mr-2">Sắp xếp theo:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="deadline">Hạn chót</option>
          <option value="user">Người được giao</option>
        </select>
      </div>

      {/* Danh sách nhiệm vụ */}
      <ul className="space-y-2">
        {sortedTasks.map(task => (
          <li
            key={task.id}
            className={`p-2 border rounded flex justify-between items-center ${
              isOverdue(task.deadline, task.done) ? 'bg-red-100' : ''
            }`}
          >
            <div>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTaskDone(task.id)}
                className="mr-2"
              />
              <span className={task.done ? 'line-through' : ''}>
                {task.text}
              </span>
              <div className="text-sm text-gray-600">
                Hạn chót: {new Date(task.deadline).toLocaleString('vi-VN')}
              </div>
              <div className="text-sm text-gray-600">
                Người được giao: {task.assignedUser}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Nhắc nhở */}
      {reminders.length > 0 && (
        <div className="mt-4 p-2 bg-yellow-100 rounded">
          <h3 className="font-bold">Nhiệm vụ sắp đến hạn:</h3>
          <ul>
            {reminders.map(task => (
              <li key={task.id}>
                {task.text} - Hạn: {new Date(task.deadline).toLocaleString('vi-VN')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
