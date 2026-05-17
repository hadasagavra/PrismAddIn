import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { store } from '../app/store';
import LoginForm from '../features/auth/components/LoginForm';
import Dashboard from '../features/manager/components/Dashboard';
import CategoriesList from '../features/manager/components/CategoriesList';
import AddCategoryForm from '../features/manager/components/AddCategoryForm';
import UpdateCategoryForm from '../features/manager/components/UpdateCategoryForm';
import AddManagerForm from '../features/manager/components/AddManagerForm';
import UpdateManagerForm from '../features/manager/components/UpdateManagerForm';
import EmailClassifier from '../features/manager/components/EmailClassifier';
import ProtectedRoute from './ProtectedRoute';
import '../styles/variables.css';

const App: React.FC = () => (
  <Provider store={store}>
    <FluentProvider theme={webLightTheme}>
<MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><CategoriesList /></ProtectedRoute>} />
          <Route path="/categories/add" element={<ProtectedRoute><AddCategoryForm /></ProtectedRoute>} />
          <Route path="/categories/edit/:id" element={<ProtectedRoute><UpdateCategoryForm /></ProtectedRoute>} />
          <Route path="/managers/add" element={<ProtectedRoute><AddManagerForm /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UpdateManagerForm /></ProtectedRoute>} />
          <Route path="/classify" element={<ProtectedRoute><EmailClassifier /></ProtectedRoute>} />

        </Routes>
      </MemoryRouter>
    </FluentProvider>
  </Provider>
);

export default App;