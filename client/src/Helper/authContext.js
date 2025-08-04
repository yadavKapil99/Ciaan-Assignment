// hooks/useAuthCheck.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import url from '../constant';

export default function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${url}/users/`, { withCredentials: true });
        if (res.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return isAuthenticated;
}
