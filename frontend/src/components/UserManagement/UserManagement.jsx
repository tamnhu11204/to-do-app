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
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const createUser = async (e) => {
        e.preventDefault();
        if (!nameInput) {
            alert('Vui lòng nhập tên người dùng!');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/users', { name: nameInput });
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
            alert('Vui lòng nhập tên người dùng!');
            return;
        }
        try {
            const res = await axios.put(`http://localhost:5000/api/users/${editingUserId}`, { name: nameInput });
            setUsers(users.map(u => u._id === editingUserId ? res.data : u));
            setEditingUserId(null);
            setNameInput('');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div className="user-manager">
            <h2>Quản lý Người dùng</h2>
            <form onSubmit={editingUserId ? updateUser : createUser} className="user-form">
                <div className="form-group">
                    <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Nhập tên người dùng"
                        required
                    />
                </div>
                <button type="submit">{editingUserId ? 'Cập nhật' : 'Thêm'} Người dùng</button>
                {editingUserId && <button type="button" onClick={() => setEditingUserId(null)}>Hủy</button>}
            </form>

            <div className="user-list">
                {users.map(user => (
                    <div key={user._id} className="user-item">
                        <span>{user.name}</span>
                        <div>
                            <button onClick={() => editUser(user)}>Sửa</button>
                            <button onClick={() => deleteUser(user._id)}>Xóa</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserManager;