import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { addCategoryApi } from '../redux/api';
import { addCategoryToState } from '../redux/managerSlice';
import Navbar from '../../../components/Navbar';
import styles from './Forms.module.css';

const AddCategoryForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const newCategory = await addCategoryApi({ name, description });
      dispatch(addCategoryToState(newCategory));
      navigate('/categories');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <h2 className={styles.formTitle}>New category</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="cat-name" className={styles.label}>Category name *</label>
            <input
              id="cat-name"
              type="text"
              className={styles.input}
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="cat-desc" className={styles.label}>Description</label>
            <textarea
              id="cat-desc"
              className={styles.textarea}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {error && <div className={styles.error} role="alert">{error}</div>}

          <div className={styles.btnGroup}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate('/categories')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryForm;