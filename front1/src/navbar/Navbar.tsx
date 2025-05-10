"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout, getCurrentUser } from '../utils/api';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<{ username: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
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

    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
        setUserData(null);
        router.push('/login');
    };

    return (
        <div className={styles.navbar}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.logo}>
                        <Link href="/" className={styles.logoLink}>
                            <img src="/Logo.png" alt="logo" width={120} height={80} />
                        </Link>
                    </div>

                    <ul className={styles.navLinks}>
                        <li>
                            <a href="https://www.innopolis.com/en/services/innopolis-lyceum" className={styles.navLink}>
                                О нас
                            </a>
                        </li>
                        <li>
                            <Link href="/materials" className={styles.navLink}>
                                Учебные материалы
                            </Link>
                        </li>
                        <li>
                            <a href="https://bio.site/innolyceum" className={styles.navLink}>
                                Соц сети
                            </a>
                        </li>
                    </ul>

                    <div className={styles.authButtons}>
                        {isLoggedIn ? (
                            <div className={styles.userMenu}>
                                <Link href="/profile" className={styles.profileButton}>
                                    {userData?.username || 'Личный кабинет'}
                                </Link>
                                <button onClick={handleLogout} className={styles.logoutButton}>
                                    Выйти
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className={styles.loginButton}>
                                Войти
                            </Link>
                        )}
                    </div>
                </header>
            </div>
        </div>
    );
}
