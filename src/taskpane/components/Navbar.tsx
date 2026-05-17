import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/redux/authSlice';
import styles from './Navbar.module.css';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const manager = useAppSelector(state => state.auth.manager);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.title}>Email Classifier</div>
        <button onClick={handleLogout} className={styles.logoutBtn} aria-label="Logout">
          {manager?.name} ▾
        </button>
      </div>
      <nav className={styles.tabs} aria-label="Main navigation">
        <button
          className={`${styles.tab} ${isActive('/dashboard') ? styles.tabActive : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`${styles.tab} ${isActive('/categories') ? styles.tabActive : ''}`}
          onClick={() => navigate('/categories')}
        >
          Categories
        </button>
        <button
          className={`${styles.tab} ${isActive('/managers') ? styles.tabActive : ''}`}
          onClick={() => navigate('/managers/add')}
        >
          Managers
        </button>
      </nav>
    </>
  );
};

export default Navbar;