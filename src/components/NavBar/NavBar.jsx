// npm modules
import { NavLink } from 'react-router-dom'

import styles from "./NavBar.module.css" 

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav className={styles.nav}>
      {user ?
        <ul>
          <div className={styles.right}></div>
          <li>
            <NavLink to="/"> Home</NavLink>
          </li>


          <li><NavLink to="/auth/logout" onClick={handleLogout}>Logout</NavLink></li>
          <li>Welcome, {user.name}</li>

          <li><NavLink to="/profiles">Profiles</NavLink></li>
          <li><NavLink to="/auth/change-password">Change Password</NavLink></li>
          <li><NavLink to="/search-books"> Search Books </NavLink></li>
          <li><NavLink to="/about"> About Us</NavLink></li>
        </ul>
      :
        <ul>
          <li><NavLink to="/"> Home</NavLink></li>
          <li><NavLink to="/auth/login">Log In</NavLink></li>
          <li><NavLink to="/auth/signup">Sign Up</NavLink></li>
          <li><NavLink to="/search-books"> Search Books </NavLink></li>
          <li><NavLink to="/about"> About Us</NavLink></li>
        </ul>
      }
    </nav>
  )
}

export default NavBar
