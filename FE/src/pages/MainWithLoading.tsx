import { useState, useEffect } from 'react';
import MainPage from './MainPage';
import Loading from './LoadingPage';

function MainWithLoading() {

  const [isLoading, setIsLoading] = useState(true);

  // 일정 시간 뒤에 MainPage로 화면 전환
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <Loading message="Now Loading..." /> : <MainPage />;
};

export default MainWithLoading;