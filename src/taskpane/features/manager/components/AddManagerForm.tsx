import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { addManagerApi } from '../redux/api';
import { addManagerToState } from '../redux/managerSlice';
import Navbar from '../../../components/Navbar';
import styles from './Forms.module.css';

const AddManagerForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: '',
    identityNumber: '',
    email: '',
    password: '',
    phoneNumber: '',
    isSuperAdmin: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const newManager = await addManagerApi(formData);
      dispatch(addManagerToState(newManager));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to create manager');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <h2 className={styles.formTitle}>New manager</h2>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.field}>
            <label htmlFor="mgr-name" className={styles.label}>Name *</label>
            <input
              id="mgr-name"
              name="name"
              type="text"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="mgr-id" className={styles.label}>Identity number *</label>
            <input
              id="mgr-id"
              name="identityNumber"
              type="text"
              autoComplete="off"
              className={styles.input}
              value={formData.identityNumber}
              onChange={handleChange}
              required
              pattern="\d{9}"
              title="9 digits"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="mgr-email" className={styles.label}>Email *</label>
            <input
              id="mgr-email"
              name="email"
              type="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="mgr-pass" className={styles.label}>Password *</label>
            <input
              id="mgr-pass"
              name="password"
              type="password"
              autoComplete="new-password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="mgr-phone" className={styles.label}>Phone number</label>
            <input
              id="mgr-phone"
              name="phoneNumber"
              type="tel"
              className={styles.input}
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="mgr-super" className={styles.checkboxLabel}>
              <input
                id="mgr-super"
                name="isSuperAdmin"
                type="checkbox"
                checked={formData.isSuperAdmin}
                onChange={handleChange}
              />
              <span>Super Admin</span>
            </label>
          </div>

          {error && <div className={styles.error} role="alert">{error}</div>}

          <div className={styles.btnGroup}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
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
      </div>
    </div>
  );
};

export default AddManagerForm;