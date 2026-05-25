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
import ManagersList from '../features/manager/components/ManagersList';
import ProtectedRoute from './ProtectedRoute';
import AddTestEmailForm from '../features/manager/components/AddTestEmailForm';
import EmailsList from '../features/manager/components/EmailsList';
import ReclassifyEmail from '../features/manager/components/ReclassifyEmail';
import '../styles/variables.css';

const App: React.FC = () => (
  <Provider store={store}>
    <FluentProvider theme={webLightTheme}>
<MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/managers" element={<ProtectedRoute><ManagersList /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><CategoriesList /></ProtectedRoute>} />
          <Route path="/categories/add" element={<ProtectedRoute><AddCategoryForm /></ProtectedRoute>} />
          <Route path="/categories/edit/:id" element={<ProtectedRoute><UpdateCategoryForm /></ProtectedRoute>} />
          <Route path="/managers/add" element={<ProtectedRoute><AddManagerForm /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UpdateManagerForm /></ProtectedRoute>} />
       {/* <Route path="/classify" element={<ProtectedRoute><EmailClassifier /></ProtectedRoute>} />*/ }  
          <Route path="/test-email" element={<ProtectedRoute><AddTestEmailForm /></ProtectedRoute>} />
          <Route path="/emails" element={<ProtectedRoute><EmailsList /></ProtectedRoute>} />
          <Route path="/emails/:id/reclassify" element={<ProtectedRoute><ReclassifyEmail /></ProtectedRoute>} />

        </Routes>
      </MemoryRouter>
    </FluentProvider>
  </Provider>
);

export default App;