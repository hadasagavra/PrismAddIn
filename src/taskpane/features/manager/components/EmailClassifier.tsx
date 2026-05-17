import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { getCategoriesApi, classifyEmailApi } from '../redux/api';
import { setCategories } from '../redux/managerSlice';
import styles from './EmailClassifier.module.css';

const EmailClassifier = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.manager.categories);

  const [emailSubject, setEmailSubject] = useState('');
  const [emailFrom, setEmailFrom] = useState('');
  const [outlookItemId, setOutlookItemId] = useState<string>('');
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
  const [emailDbId, setEmailDbId] = useState<number | null>(null);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // טעינת הקטגוריות מהשרת
    getCategoriesApi().then(data => dispatch(setCategories(data)));

    // בדיקה אם רצים בתוסף או בדפדפן רגיל
    if (typeof Office === 'undefined') {
      // דפדפן רגיל — נתוני דוגמא
      setEmailSubject('Payment confirmation');
      setEmailFrom('john@company.com');
      return;
    }

    // תוסף Outlook — קריאת המייל הנבחר
    Office.onReady(() => {
      const item = Office.context.mailbox.item;
      if (!item) return;

      setEmailSubject(item.subject ?? '');
      setOutlookItemId(item.itemId ?? '');

      // קריאת השולח (תלוי בסוג המייל)
      if ('from' in item && item.from) {
        const from = item.from as Office.EmailAddressDetails;
        setEmailFrom(from.emailAddress);
      }

      // קריאת תוכן המייל (async)
      item.body?.getAsync(Office.CoercionType.Text, (result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          // אופציונלי: שלח ל-Backend לסיווג ראשוני
          // ולקבל את הקטגוריה הנוכחית
        }
      });
    });
  }, [dispatch]);

  const currentCategoryName = categories.find(c => c.id === currentCategoryId)?.name;

  const handleClassify = async () => {
    if (!selectedCategoryId || !emailDbId) {
      setError('Email not yet saved to database');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // 1. עדכון ה-Backend
      await classifyEmailApi(emailDbId, {
        categoryId: selectedCategoryId,
        notes: notes || undefined
      });

      // 2. העברת המייל לתיקייה באאוטלוק (אם רצים בתוסף)
      if (typeof Office !== 'undefined' && outlookItemId) {
        const newCategoryName = categories.find(c => c.id === selectedCategoryId)?.name;
        if (newCategoryName) {
          await moveEmailToFolder(outlookItemId, newCategoryName);
        }
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Email Classifier</div>

      <div className={styles.content}>
        <div className={styles.emailCard}>
          <div className={styles.emailSubject}>{emailSubject || 'No email selected'}</div>
          <div className={styles.emailFrom}>from: {emailFrom}</div>
          {currentCategoryName && (
            <div className={styles.currentBadge}>
              Current: {currentCategoryName}
            </div>
          )}
        </div>

        <label htmlFor="cat-select" className={styles.label}>Move to category</label>
        <select 
          id="cat-select"
          className={styles.select}
          value={selectedCategoryId ?? ''}
          onChange={e => setSelectedCategoryId(Number(e.target.value))}
        >
          <option value="">Select category...</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <label htmlFor="notes" className={styles.label}>Note (optional)</label>
        <textarea 
          id="notes"
          className={styles.textarea}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Why did you change this?"
        />

        {error && <div className={styles.error}>{error}</div>}

        <button 
          className={styles.submitBtn}
          onClick={handleClassify}
          disabled={!selectedCategoryId || loading}
        >
          {loading ? 'Moving...' : 'Move email'}
        </button>

        {success && (
          <div className={styles.success}>
            ✓ Email moved successfully
          </div>
        )}
      </div>
    </div>
  );
};

// פונקציה להעברת מייל לתיקייה באאוטלוק
const moveEmailToFolder = (itemId: string, folderName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const ewsRequest = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                     xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
        <soap:Body>
          <m:MoveItem xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages">
            <m:ToFolderId>
              <t:DistinguishedFolderId Id="${folderName}"/>
            </m:ToFolderId>
            <m:ItemIds>
              <t:ItemId Id="${itemId}"/>
            </m:ItemIds>
          </m:MoveItem>
        </soap:Body>
      </soap:Envelope>`;

    Office.context.mailbox.makeEwsRequestAsync(ewsRequest, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        resolve();
      } else {
        reject(new Error('Failed to move email'));
      }
    });
  });
};

export default EmailClassifier;