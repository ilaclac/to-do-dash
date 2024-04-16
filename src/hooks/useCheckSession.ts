import { useEffect, useState, useCallback } from 'react';
import { fetchApi } from '@/src/lib/fetchApi';
import { CHECK_SESSION_ROUTE, LOGOUT_ROUTE } from '@/src/constants';
import { useRouter } from 'next/router';
const useCheckSession = () => {
  const [isLoggedIn, setIsLoggedIn] = useState({ status: false, userName: '' });

  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetchApi('GET', CHECK_SESSION_ROUTE);
        if (response.data.isLoggedIn && response.data.name) {
          setIsLoggedIn({
            status: response.data.isLoggedIn,
            userName: response.data.name,
          });
        } else {
          setIsLoggedIn({ status: false, userName: '' });
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setIsLoggedIn({ status: false, userName: '' });
      }
    };

    checkSession();
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await fetchApi('POST', LOGOUT_ROUTE);
      if (response.status === 200) {
        setIsLoggedIn({ status: false, userName: '' });

        if (router.pathname.includes('dashboard')) {
          await router.push('/');
        }
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [router]);

  return { ...isLoggedIn, logout };
};

export default useCheckSession;
