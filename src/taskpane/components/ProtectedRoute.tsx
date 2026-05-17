import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  // const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  
  return <>{children}</>;
};

export default ProtectedRoute;