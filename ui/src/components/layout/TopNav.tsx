import { Link, NavLink } from 'react-router-dom';
import styles from './TopNav.module.css';

export function TopNav() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandIcon}>♟</span>
          <span className={styles.brandName}>Searchless Chess</span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              [styles.navLink, isActive ? styles.active : ''].join(' ')
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/play"
            className={({ isActive }) =>
              [styles.navLink, isActive ? styles.active : ''].join(' ')
            }
          >
            Play
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              [styles.navLink, isActive ? styles.active : ''].join(' ')
            }
          >
            Settings
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
