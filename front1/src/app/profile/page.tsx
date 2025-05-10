"use client";

import { useState, useEffect } from 'react';
import Navbar from '../../navbar/Navbar';
import { fetchWithAuth } from '../../utils/api';
import styles from './page.module.css';

interface User {
    username: string;
    disabled: boolean;
}

interface ApiError {
    message: string;
}

export default function Profile() {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Загрузка списка пользователей
    const loadUsers = async () => {
        try {
            const data = await fetchWithAuth('/users');
            setUsers(data);
        } catch (err) {
            setError('Ошибка при загрузке пользователей');
            console.error(err);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // Создание нового пользователя
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await fetchWithAuth('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            setSuccess('Пользователь успешно создан');
            setNewUser({ username: '', password: '' });
            loadUsers(); // Перезагружаем список пользователей
        } catch (err: unknown) {
            const error = err as ApiError;
            setError(error.message || 'Ошибка при создании пользователя');
        } finally {
            setLoading(false);
        }
    };

    // Удаление пользователя
    const handleDeleteUser = async (username: string) => {
        if (!confirm(`Вы уверены, что хотите удалить пользователя ${username}?`)) {
            return;
        }

        try {
            await fetchWithAuth(`/users/${username}`, {
                method: 'DELETE',
            });

            setSuccess('Пользователь успешно удален');
            loadUsers(); // Перезагружаем список пользователей
        } catch (err: unknown) {
            const error = err as ApiError;
            setError(error.message || 'Ошибка при удалении пользователя');
        }
    };

    return (
        <div className={styles.profileBackground}>
            <Navbar />
            <div className="container">
                <div className={styles.profileContainer}>
                    <h1 className={styles.profileTitle}>Управление пользователями</h1>

                    {error && <div className={styles.error}>{error}</div>}
                    {success && <div className={styles.success}>{success}</div>}

                    {/* Форма создания пользователя */}
                    <div className={styles.createUserForm}>
                        <h2>Создать нового пользователя</h2>
                        <form onSubmit={handleCreateUser}>
                            <div className={styles.formGroup}>
                                <label htmlFor="username">Имя пользователя</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="password">Пароль</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? 'Создание...' : 'Создать пользователя'}
                            </button>
                        </form>
                    </div>

                    {/* Список пользователей */}
                    <div className={styles.usersList}>
                        <h2>Список пользователей</h2>
                        <div className={styles.usersTable}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Имя пользователя</th>
                                        <th>Статус</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.username}>
                                            <td>{user.username}</td>
                                            <td>{user.disabled ? 'Отключен' : 'Активен'}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDeleteUser(user.username)}
                                                    className={styles.deleteButton}
                                                >
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 