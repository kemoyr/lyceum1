import './navBar.css'
import { NavLink } from 'react-router'

export default function NavBar() {
  return (
    <div className="container">
    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div className="col-md-3 mb-2 mb-md-0">
        <NavLink to="/" className="d-inline-flex link-body-emphasis text-decoration-none">
          <img src="/Logo.png" alt="logo" width={120} height={80} />
        </NavLink>
      </div>

      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li><a href="https://www.innopolis.com/en/services/innopolis-lyceum" className="nav-link px-2">О нас</a></li>
        <li><NavLink to="/materials" className="nav-link px-2">Учебные материалы</NavLink></li>
        <li><a href="https://bio.site/innolyceum" className="nav-link px-2">Соц сети</a></li>
        {/* <li><a href="#" className="nav-link px-2">About</a></li> */}
      </ul>

      <div className="col-md-3 text-end">
        {/* <button type="button" className="btn btn-outline-primary me-2">Login</button> */}
        <NavLink to="/login" className="btn btn-primary"><button>Войти</button></NavLink>
      </div>
    </header>
  </div>
  )
}