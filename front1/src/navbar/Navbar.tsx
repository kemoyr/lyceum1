import styles from './Navbar.module.css';
import Link from 'next/link'

export default function Navbar() {
    return (
        <div className={styles["navbar-container"]}>
            <div className="container">
                <header className={`d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-2 mb-3 border-bottom ${styles["navbar-header"]}`}>
                    <div className="col-md-3 mb-2 mb-md-0">
                        <Link href="/" className="d-inline-flex link-body-emphasis text-decoration-none">
                            <img src="/Logo.png" alt="logo" className={styles.logo} />
                        </Link>
                    </div>
                
                    <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                        <li><a href="https://www.innopolis.com/en/services/innopolis-lyceum" className={`nav-link px-2 ${styles["nav-link"]}`}>О нас</a></li>
                        <li><Link href="/materials" className={`nav-link px-2 ${styles["nav-link"]}`}>Учебные материалы</Link></li>
                        <li><a href="https://bio.site/innolyceum" className={`nav-link px-2 ${styles["nav-link"]}`}>Соц сети</a></li>
                        {/* <li><a href="#" className="nav-link px-2">About</a></li> */}
                    </ul>
                
                    <div className="col-md-3 text-end">
                        {/* <button type="button" className="btn btn-outline-primary me-2">Login</button> */}
                        <Link href="/login">
                            <span className={styles["custom-login-btn"]}>Войти</span>
                        </Link>
                    </div>
                </header>
            </div>
        </div> 
    )
}
