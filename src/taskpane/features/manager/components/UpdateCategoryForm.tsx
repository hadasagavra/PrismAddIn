import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateCategoryApi } from '../redux/api';
import { updateCategoryInState } from '../redux/managerSlice';
import Navbar from '../../../components/Navbar';
import styles from './Forms.module.css';

const UpdateCategoryForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const category = useAppSelector(state =>
    state.manager.categories.find(c => c.id === Number(id))
  );

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description ?? '');
    }
  }, [category]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setLoading(true);
    try {
      const updated = await updateCategoryApi(Number(id), { name, description });
      dispatch(updateCategoryInState(updated));
      navigate('/categories');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <h2 className={styles.formTitle}>Edit category</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="edit-cat-name" className={styles.label}>Category name *</label>
            <input
              id="edit-cat-name"
              type="text"
              className={styles.input}
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="edit-cat-desc" className={styles.label}>Description</label>
            <textarea
              id="edit-cat-desc"
              className={styles.textarea}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {error && <div className={styles.error} role="alert">{error}</div>}

          <div className={styles.btnGroup}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
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

export default UpdateCategoryForm;