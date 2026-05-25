import { useState, useEffect, FormEvent } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { addEmailApi, getCategoriesApi } from '../redux/api';
import { setCategories } from '../redux/managerSlice';
import Navbar from '../../../components/Navbar';
import styles from './AddTestEmailForm.module.css';

const AddTestEmailForm = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.manager.categories);

  const [subject, setSubject] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ category: string; confidence: number } | null>(null);

  useEffect(() => {
    getCategoriesApi().then(data => dispatch(setCategories(data)));
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const email = await addEmailApi({ subject, content, senderEmail });
      const categoryName = categories.find(c => c.id === email.categoryId)?.name ?? 'Unknown';

      setResult({
        category: categoryName,
        confidence: email.classificationConfidence ?? 0,
      });

      setSubject('');
      setSenderEmail('');
      setContent('');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to classify email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <h2 className={styles.title}>Add test email</h2>
        <div className={styles.subtitle}>
          Simulate an incoming email. It will be classified automatically.
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="subject" className={styles.label}>Subject *</label>
            <input
              id="subject"
              type="text"
              className={styles.input}
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="from" className={styles.label}>From email *</label>
            <input
              id="from"
              type="email"
              className={styles.input}
              value={senderEmail}
              onChange={e => setSenderEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="content" className={styles.label}>Email content *</label>
            <textarea
              id="content"
              className={styles.textarea}
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={6}
            />
          </div>

          <div className={styles.tip}>
            💡 Tip: The classifier learns from each email. Try different topics.
          </div>

          {error && <div className={styles.error} role="alert">{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Classifying...' : 'Send for classification'}
          </button>

          {result && (
            <div className={styles.success}>
              ✓ Email classified as <strong>{result.category}</strong> 
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddTestEmailForm;