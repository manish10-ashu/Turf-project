import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;