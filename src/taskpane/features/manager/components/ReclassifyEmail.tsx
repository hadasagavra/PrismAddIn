import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { getEmailByIdApi, classifyEmailApi, getCategoriesApi } from '../redux/api';
import { setCategories } from '../redux/managerSlice';
import { Email } from '../../../types';
import Navbar from '../../../components/Navbar';
import styles from './ReclassifyEmail.module.css';

const ReclassifyEmail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.manager.categories);

  const [email, setEmail] = useState<Email | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    getCategoriesApi().then(data => dispatch(setCategories(data)));
    getEmailByIdApi(Number(id))
      .then(setEmail)
      .catch(() => setError('Failed to load email'));
  }, [id, dispatch]);

  const currentCategoryName = email
    ? categories.find(c => c.id === email.categoryId)?.name ?? 'Unknown'
    : '';

  const availableCategories = categories.filter(c => c.id !== email?.categoryId);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !selectedCategoryId) return;
    setError('');
    setLoading(true);
    try {
      await classifyEmailApi(email.id, {
        categoryId: selectedCategoryId,
        notes: notes || undefined,
      });
      setSuccess(true);
      setTimeout(() => navigate('/emails'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to reclassify');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
          {error ? <div className={styles.error}>{error}</div> : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate('/emails')}
          >
            ←
          </button>
          <h2 className={styles.title}>Reclassify email</h2>
        </div>

        <div className={styles.emailCard}>
          <div className={styles.emailSubject}>{email.subject}</div>
          <div className={styles.emailMeta}>from: {email.senderEmail}</div>
          <div className={styles.emailMeta}>
            Received: {new Date(email.receivedAt).toLocaleDateString()}
          </div>
          <div className={styles.currentBadge}>Current: {currentCategoryName}</div>
        </div>

        <label className={styles.label}>Email content</label>
        <div className={styles.contentBox}>{email.content}</div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="newCat" className={styles.label}>Move to category</label>
          <select
            id="newCat"
            className={styles.select}
            value={selectedCategoryId ?? ''}
            onChange={e => setSelectedCategoryId(Number(e.target.value))}
            required
          >
            <option value="">Select a category...</option>
            {availableCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <label htmlFor="notes" className={styles.label}>Reason (optional)</label>
          <textarea
            id="notes"
            className={styles.textarea}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
          />

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!selectedCategoryId || loading}
          >
            {loading ? 'Reclassifying...' : 'Reclassify'}
          </button>

          {success && (
            <div className={styles.success}>
              ✓ Email reclassified successfully
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReclassifyEmail;