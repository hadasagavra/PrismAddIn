import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { updateManagerApi, getManagerByIdApi ,changePasswordApi} from '../redux/api';
import Navbar from '../../../components/Navbar';
import styles from './Forms.module.css';

const UpdateManagerForm = () => {
  const navigate = useNavigate();
  const authManager = useAppSelector(state => state.auth.manager);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [passwordMsg, setPasswordMsg] = useState('');

  // טעינת המנהל המלא מה-Backend (כולל טלפון)
  useEffect(() => {
    if (!authManager) return;
    getManagerByIdApi(authManager.id)
      .then(fullManager => {
        setName(fullManager.name);
        setEmail(fullManager.email);
        setPhoneNumber(fullManager.phoneNumber ?? '');
      })
      .catch(() => setError('Failed to load profile'));
  }, [authManager]);
  const handleChangePassword = async () => {
  if (!authManager) return;
  if (newPassword.length < 8) {
    setPasswordMsg('Password must be at least 8 characters');
    return;
  }
  try {
    await changePasswordApi(authManager.id, { currentPassword, newPassword });
    setPasswordMsg('✓ Password changed');
    setCurrentPassword('');
    setNewPassword('');
  } catch (err: any) {
    setPasswordMsg(err.response?.data?.message ?? 'Failed to change password');
  }
};


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!authManager) return;
    setError('');
    setLoading(true);
    try {
      await updateManagerApi(authManager.id, {
        name,
        phoneNumber,
        isActive: true,
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <h2 className={styles.formTitle}>My profile</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="profile-name" className={styles.label}>Name *</label>
            <input
              id="profile-name"
              type="text"
              className={styles.input}
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="profile-email" className={styles.label}>Email</label>
            <input
              id="profile-email"
              type="email"
              className={styles.input}
              value={email}
              disabled
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="profile-phone" className={styles.label}>Phone number</label>
            <input
              id="profile-phone"
              type="tel"
              className={styles.input}
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />
          </div>

          {error && <div className={styles.error} role="alert">{error}</div>}
          {success && <div className={styles.success}>✓ Profile updated</div>}

          <div className={styles.btnGroup}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
        <div style={{ marginTop: '24px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
  <h3 className={styles.formTitle}>Change password</h3>
  
  <div className={styles.field}>
    <label htmlFor="current-pass" className={styles.label}>Current password</label>
    <input
      id="current-pass"
      type="password"
      autoComplete="off"
      className={styles.input}
      value={currentPassword}
      onChange={e => setCurrentPassword(e.target.value)}
    />
  </div>

  <div className={styles.field}>
    <label htmlFor="new-pass" className={styles.label}>New password</label>
    <input
      id="new-pass"
      type="password"
      autoComplete="new-password"
      className={styles.input}
      value={newPassword}
      onChange={e => setNewPassword(e.target.value)}
    />
  </div>

  {passwordMsg && <div className={styles.success}>{passwordMsg}</div>}

  <button
    type="button"
    className={styles.submitBtn}
    onClick={handleChangePassword}
    disabled={!currentPassword || !newPassword}
  >
    Change password
  </button>
</div>
      </div>
    </div>
  );
};

export default UpdateManagerForm;