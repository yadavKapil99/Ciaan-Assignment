import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import Layout from './Layout';
import useAuthCheck from '../Helper/authContext';

const ProtectedRoute = () => {
  const isAuthenticated = useAuthCheck();

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default ProtectedRoute;