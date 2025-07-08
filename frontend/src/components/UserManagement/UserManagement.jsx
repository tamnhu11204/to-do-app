import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [nameInput, setNameInput] = useState('');
    const [editingUserId, setEditingUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/user/get-all');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const createUser = async (e) => {
        e.preventDefault();
        if (!nameInput) {
            alert('Please enter username!');
            return;
        }
        try {
            const res = await axios.post('http://localhost:3001/api/user/create', { name: nameInput });
            setUsers([...users, res.data]);
            setNameInput('');
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const editUser = (user) => {
        setEditingUserId(user._id);
        setNameInput(user.name);
    };

    const updateUser = async (e) => {
        e.preventDefault();
        if (!nameInput) {
            alert('Please enter username!');
            return;
        }
        try {
            const res = await axios.put(`http://localhost:3001/api/user/update/${editingUserId}`, { name: nameInput });
            setUsers(users.map(u => u._id === editingUserId ? res.data : u));
            setEditingUserId(null);
            setNameInput('');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure to delete this user?')) {
            try {
                await axios.delete(`http://localhost:3001/api/user/delete/${id}`);
                setUsers(users.filter(user => user._id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div class="user-manager">
            <div class="card">
                <div class="card-header">
                    <h2 class="text-center fw-bold">User Management</h2>
                </div>
                <div class="card-body">
                    <form onSubmit={editingUserId ? updateUser : createUser} class="user-form">
                        <div class="row mb-3">
                            <div class="col-2">
                                <label class="form-label fw-bold">Task</label>
                            </div>
                            <div class="col-10">
                                <input
                                    class="form-control"
                                    type="text"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    placeholder="Enter username..."
                                    required
                                />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-2">
                                <button type="submit" class="btn btn-success mb-3">{editingUserId ? 'Update' : 'Add'} user</button>
                            </div>
                            <div class="col-2">
                                {editingUserId && <button class="btn btn-dark" type="button" onClick={() => setEditingUserId(null)}>Cancel</button>}
                            </div>
                        </div>
                    </form>

                    <div class="user-list">
                        {users.map(user => (
                            <div key={user._id} class="user-item">
                                <span>{user.name}</span>
                                <div>
                                    <button class="btn btn-warning btn-sm me-2" onClick={() => editUser(user)}><i class="bi bi-pencil-square" /></button>
                                    <button class="btn btn-danger btn-sm" onClick={() => deleteUser(user._id)}><i class="bi bi-trash" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManager;