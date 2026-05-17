import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getCategoriesApi, getManagersApi } from '../redux/api';
import { setCategories, setManagers } from '../redux/managerSlice';
import Navbar from '../../../components/Navbar';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const manager = useAppSelector(state => state.auth.manager);
  const categories = useAppSelector(state => state.manager.categories);
  const managers = useAppSelector(state => state.manager.managers);

  useEffect(() => {
    getCategoriesApi().then(data => dispatch(setCategories(data)));
    getManagersApi().then(data => dispatch(setManagers(data)));
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.welcome}>
          Welcome, <span className={styles.welcomeName}>{manager?.name}</span>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Categories</div>
            <div className={styles.statValue}>{categories.length}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Managers</div>
            <div className={styles.statValue}>{managers.length}</div>
          </div>
        </div>

        <div className={styles.sectionLabel}>Quick actions</div>
        <button className={styles.actionBtn} onClick={() => navigate('/categories/add')}>
          + Add category
        </button>
        <button className={styles.actionBtn} onClick={() => navigate('/managers/add')}>
          + Add manager
        </button>
        <button className={styles.actionBtn} onClick={() => navigate('/profile')}>
       ⚙️ My profile
        </button>
      </div>
    </div>
  );
};

export default Dashboard;