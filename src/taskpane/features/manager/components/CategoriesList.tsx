import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getCategoriesApi, deleteCategoryApi } from '../redux/api';
import { setCategories, removeCategoryFromState } from '../redux/managerSlice';
import Navbar from '../../../components/Navbar';
import styles from './CategoriesList.module.css';

const CategoriesList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.manager.categories);

  useEffect(() => {
    getCategoriesApi().then(data => dispatch(setCategories(data)));
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this category?')) {
      await deleteCategoryApi(id);
      dispatch(removeCategoryFromState(id));
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <button className={styles.addBtn} onClick={() => navigate('/categories/add')}>
          + New category
        </button>

        {categories.length === 0 ? (
          <div className={styles.empty}>No categories yet</div>
        ) : (
          categories.map(({ id, name }) => (
            <div key={id} className={styles.item}>
              <div className={styles.itemName}>{name}</div>
              <div className={styles.itemActions}>
                <button
                  className={styles.editBtn}
                  onClick={() => navigate(`/categories/edit/${id}`)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoriesList;