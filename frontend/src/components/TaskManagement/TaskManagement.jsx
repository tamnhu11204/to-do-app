import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskManagement.css';

const TaskManager = ({ sortBy, setSortBy }) => {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [deadline, setDeadline] = useState('');
    const [assignedUser, setAssignedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, [sortBy]);

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/tasks?sortBy=${sortBy}`);
            setTasks(res.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const createTask = async (e) => {
        e.preventDefault();
        if (!taskInput || !deadline || !assignedUser) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/tasks', {
                text: taskInput,
                deadline,
                assignedUser,
                done: false,
            });
            setTasks([...tasks, res.data]);
            setTaskInput('');
            setDeadline('');
            setAssignedUser('');
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const editTask = (task) => {
        setEditingTaskId(task._id);
        setTaskInput(task.text);
        setDeadline(new Date(task.deadline).toISOString().slice(0, 16));
        setAssignedUser(task.assignedUser._id);
    };

    const updateTask = async (e) => {
        e.preventDefault();
        if (!taskInput || !deadline || !assignedUser) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        try {
            const res = await axios.put(`http://localhost:5000/api/tasks/${editingTaskId}`, {
                text: taskInput,
                deadline,
                assignedUser,
                done: tasks.find(t => t._id === editingTaskId).done,
            });
            setTasks(tasks.map(t => t._id === editingTaskId ? res.data : t));
            setEditingTaskId(null);
            setTaskInput('');
            setDeadline('');
            setAssignedUser('');
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa nhiệm vụ này?')) {
            try {
                await axios.delete(`http://localhost:5000/api/tasks/${id}`);
                setTasks(tasks.filter(task => task._id !== id));
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const toggleDone = async (id) => {
        try {
            const task = tasks.find(t => t._id === id);
            const res = await axios.patch(`http://localhost:5000/api/tasks/${id}/toggle`, {
                done: !task.done,
            });
            setTasks(tasks.map(t => t._id === id ? res.data : t));
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const getTaskClass = (task) => {
        const now = new Date();
        const deadlineDate = new Date(task.deadline);
        const timeDiff = deadlineDate - now;
        if (task.done) return '';
        if (timeDiff < 0) return 'expired';
        if (timeDiff < 30 * 60 * 1000) return 'near-deadline';
        return '';
    };

    return (
        <div className="task-manager">
            <h2>Quản lý Nhiệm vụ</h2>
            <form onSubmit={editingTaskId ? updateTask : createTask} className="task-form">
                <div className="form-group">
                    <input
                        type="text"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        placeholder="Nhập nhiệm vụ"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <select
                        value={assignedUser}
                        onChange={(e) => setAssignedUser(e.target.value)}
                        required
                    >
                        <option value="">Chọn người dùng</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">{editingTaskId ? 'Cập nhật' : 'Thêm'} Nhiệm vụ</button>
                {editingTaskId && <button type="button" onClick={() => setEditingTaskId(null)}>Hủy</button>}
            </form>

            <div className="sort-section">
                <label>Sắp xếp theo: </label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="deadline">Deadline</option>
                    <option value="done">Trạng thái</option>
                    <option value="assignedUser">Người dùng</option>
                </select>
            </div>

            <div className="task-list">
                {tasks.map(task => (
                    <div key={task._id} className={`task-item ${getTaskClass(task)}`}>
                        <span>{task.text} - {new Date(task.deadline).toLocaleString()} - {task.assignedUser.name} - {task.done ? 'Hoàn thành' : 'Chưa hoàn thành'}</span>
                        <div>
                            <button onClick={() => editTask(task)}>Sửa</button>
                            <button onClick={() => deleteTask(task._id)}>Xóa</button>
                            <button onClick={() => toggleDone(task._id)}>
                                {task.done ? 'Hoãn' : 'Hoàn thành'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskManager;