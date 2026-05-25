import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getManagersApi, deleteManagerApi } from '../redux/api';
import { setManagers, removeManagerFromState } from '../redux/managerSlice';
import Navbar from '../../../components/Navbar';
import styles from './ManagersList.module.css';

const ManagersList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const managers = useAppSelector(state => state.manager.managers);
  const currentManager = useAppSelector(state => state.auth.manager);
  const [error, setError] = useState('');

  useEffect(() => {
    getManagersApi()
      .then(data => dispatch(setManagers(data)))
      .catch(() => setError('Failed to load managers'));
  }, [dispatch]);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete manager "${name}"?`)) return;
    try {
      await deleteManagerApi(id);
      dispatch(removeManagerFromState(id));
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to delete manager');
    }
  };

  // Super Admin יכול למחוק מנהל רגיל, לא Super Admin אחר
  const canDelete = (managerToCheck: { id: number; isSuperAdmin: boolean }) => {
    if (!currentManager?.isSuperAdmin) return false;
    if (managerToCheck.isSuperAdmin) return false;
    return true;
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Managers</h2>
          {currentManager?.isSuperAdmin && (
            <button className={styles.addBtn} onClick={() => navigate('/managers/add')}>
              + Add manager
            </button>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {managers.length === 0 ? (
          <div className={styles.empty}>No managers yet</div>
        ) : (
          managers.map(manager => (
            <div key={manager.id} className={styles.item}>
              <div className={styles.itemLeft}>
                <div className={styles.itemName}>
                  {manager.name}
                  {manager.isSuperAdmin && (
                    <span className={styles.superBadge}>Super Admin</span>
                  )}
                  {manager.id === currentManager?.id && (
                    <span className={styles.youBadge}>You</span>
                  )}
                </div>
                <div className={styles.itemEmail}>{manager.email}</div>
                {!manager.isActive && (
                  <span className={styles.inactiveBadge}>Inactive</span>
                )}
              </div>

              {canDelete(manager) && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(manager.id, manager.name)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagersList;