"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../navbar/Navbar";
import styles from "./page.module.css";
import { isAuthenticated, logout, getCurrentUser } from "../../utils/api";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<{ username: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Проверяем авторизацию при загрузке компонента
        const checkAuth = async () => {
            if (isAuthenticated()) {
                setIsLoggedIn(true);
                try {
                    const user = await getCurrentUser();
                    setUserData(user);
                } catch (err) {
                    console.error('Ошибка получения данных пользователя:', err);
                }
            }
        };
        
        checkAuth();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!username || !password) {
            setError("Пожалуйста, введите логин и пароль");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);

            const response = await fetch("http://localhost:8000/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Ошибка при входе в систему");
            }

            // Сохраняем токен в localStorage
            localStorage.setItem("token", data.access_token);
            setIsLoggedIn(true);
            
            // Получаем данные пользователя
            const user = await getCurrentUser();
            setUserData(user);
            
            // Перенаправляем на главную страницу
            router.push("/");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Произошла ошибка при входе в систему");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
        setUserData(null);
        router.push("/login");
    };

    return (
        <div className={styles.loginBackground}>
            <Navbar />
            <div className="container">
                <div className={styles.loginContainer}>
                    <h1 className={styles.loginTitle}>
                        {isLoggedIn ? "Личный кабинет" : "Вход в систему"}
                    </h1>
                    
                    {isLoggedIn ? (
                        <div className={styles.loggedInContainer}>
                            <p className={styles.welcomeText}>
                                Добро пожаловать, {userData?.username}!
                            </p>
                            <button 
                                onClick={handleLogout} 
                                className={styles.btnLogin}
                            >
                                Выйти
                            </button>
                        </div>
                    ) : (
                        <>
                            {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="login" className={styles.formLabel}>Логин</label>
                                    <input 
                                        type="text" 
                                        id="login" 
                                        className={styles.formControl} 
                                        placeholder="Введите логин" 
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="password" className={styles.formLabel}>Пароль</label>
                                    <input 
                                        type="password" 
                                        id="password" 
                                        className={styles.formControl} 
                                        placeholder="Введите пароль" 
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className={styles.btnLogin}
                                    disabled={loading}
                                >
                                    {loading ? "Вход..." : "Войти"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}