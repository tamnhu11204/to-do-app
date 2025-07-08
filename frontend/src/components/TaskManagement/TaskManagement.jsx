import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskManagement.css';

const TaskManagement = ({ sortBy, setSortBy }) => {
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
            const res = await axios.get(`http://localhost:3001/api/task/get-all?sortBy=${sortBy}`);
            setTasks(res.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/user/get-all');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const createTask = async (e) => {
        e.preventDefault();
        if (!taskInput || !deadline || !assignedUser) {
            alert('Please fill out all fields!');
            return;
        }
        try {
            const res = await axios.post('http://localhost:3001/api/task/create', {
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
            alert('Please fill out all fields!');
            return;
        }
        try {
            const res = await axios.put(`http://localhost:3001/api/task/update/${editingTaskId}`, {
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
        if (window.confirm('Are you sure to delete this task?')) {
            try {
                await axios.delete(`http://localhost:3001/api/task/delete/${id}`);
                setTasks(tasks.filter(task => task._id !== id));
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const toggleDone = async (id) => {
        try {
            const task = tasks.find(t => t._id === id);
            const res = await axios.patch(`http://localhost:3001/api/task/toggle-task-done/${id}`, {
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
            <div className="card">
                <div className="card-header">
                    <h2 className="text-center fw-bold">Task Management</h2>
                </div>
                <div className="card-body">
                    <form className="task-form" onSubmit={editingTaskId ? updateTask : createTask}>
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
                                    required
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
                                    required
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
                                    required
                                >
                                    <option value="">Choose user who will do this task...</option>
                                    {users.map(user => (
                                        <option key={user._id} value={user._id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="d-flex justify-content-start mb-3">
                            <button type="submit" className="btn btn-success me-2">{editingTaskId ? 'Update' : 'Add'} Task</button>
                            {editingTaskId && <button className="btn btn-dark" type="button" onClick={() => setEditingTaskId(null)}>Cancel</button>}
                        </div>
                    </form>

                    <div className="row mb-3">
                        <div className="col-2">
                            <label className="form-label fw-bold">Sort by: </label>
                        </div>
                        <div className="col-10">
                            <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="deadline">Deadline</option>
                                <option value="done">Active</option>
                                <option value="assignedUser">User</option>
                            </select>
                        </div>
                    </div>

                    <div className="task-list">
                        {tasks.map(task => (
                            <div key={task._id} className={`task-item ${getTaskClass(task)}`}>
                                <input
                                    type="checkbox"
                                    className="form-check-input me-2"
                                    checked={task.done}
                                    onChange={() => toggleDone(task._id)}
                                />
                                <span>{task.text} - {new Date(task.deadline).toLocaleString()} - {task.assignedUser.name} - {task.done ? 'Done' : 'To do'}</span>
                                <div>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => editTask(task)}>
                                        <i className="bi bi-pencil-square" />
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task._id)}>
                                        <i className="bi bi-trash" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskManagement;