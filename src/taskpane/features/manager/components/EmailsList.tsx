import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { getEmailsApi, getCategoriesApi } from '../redux/api';
import { setEmails, setCategories } from '../redux/managerSlice';
import Navbar from '../../../components/Navbar';
import styles from './EmailsList.module.css';

const EmailsList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const emails = useAppSelector(state => state.manager.emails);
  const categories = useAppSelector(state => state.manager.categories);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    getEmailsApi().then(data => dispatch(setEmails(data)));
    getCategoriesApi().then(data => dispatch(setCategories(data)));
  }, [dispatch]);

  const getEmailsForCategory = (categoryId: number) =>
    emails.filter(e => e.categoryId === categoryId);

  const toggleCategory = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <h2 className={styles.title}>Classified emails</h2>

        {categories.length === 0 ? (
          <div className={styles.empty}>No categories yet</div>
        ) : (
          categories.map(cat => {
            const catEmails = getEmailsForCategory(cat.id);
            const isExpanded = expandedId === cat.id;

            return (
              <div key={cat.id} className={styles.categoryGroup}>
                <div
                  className={styles.categoryHeader}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <div className={styles.categoryHeaderLeft}>
                    <span className={styles.arrow}>{isExpanded ? '▼' : '▶'}</span>
                    <span className={styles.categoryName}>{cat.name}</span>
                    <span className={catEmails.length > 0 ? styles.badge : styles.badgeEmpty}>
                      {catEmails.length}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.emailsList}>
                    {catEmails.length === 0 ? (
                      <div className={styles.noEmails}>No emails in this category</div>
                    ) : (
                      catEmails.map(email => (
                        <div
                          key={email.id}
                          className={styles.emailItem}
                          onClick={() => navigate(`/emails/${email.id}/reclassify`)}
                        >
                          <div className={styles.emailSubject}>{email.subject}</div>
                          <div className={styles.emailSender}>from: {email.senderEmail}</div>
                          {email.classificationConfidence !== undefined && (
                            <div className={styles.emailConfidence}>
                              {email.classificationConfidence}% confidence
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EmailsList;