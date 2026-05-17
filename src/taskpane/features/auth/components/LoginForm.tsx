import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Label } from '@fluentui/react-components';
import { useAppDispatch } from '../../../app/hooks';
import { loginApi } from '../redux/api';
import { loginSuccess } from '../redux/authSlice';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginApi({ name, password });
      dispatch(loginSuccess(response));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>
          <h2 className={styles.title}>Email Classifier</h2>
          <div className={styles.subtitle}>Administrator sign-in</div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <Label htmlFor="name" required>Username</Label>
            <Input
              id="name"
              aria-label="Username"
              value={name}
              onChange={(_, { value }) => setName(value)}
              required
            />
          </div>
          
          <div className={styles.field}>
            <Label htmlFor="password" required>Password</Label>
            <Input
              id="password"
              type="password"
              aria-label="Password"
              value={password}
              onChange={(_, { value }) => setPassword(value)}
              required
            />
          </div>
          
          {error && <div className={styles.error} role="alert">{error}</div>}
          
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;