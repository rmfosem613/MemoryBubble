import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

const PWAInstaller = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  
  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      },
    });

    return () => {
      updateSW && updateSW();
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleClose = () => {
    setNeedRefresh(false);
    setOfflineReady(false);
  };

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white rounded-lg shadow-lg">
      {offlineReady && (
        <div className="mb-2">
          <p className="text-green-600">앱이 오프라인에서도 사용 가능합니다.</p>
          <button 
            onClick={handleClose}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            확인
          </button>
        </div>
      )}
      {needRefresh && (
        <div>
          <p>새 버전이 사용 가능합니다.</p>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              업데이트
            </button>
            <button 
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PWAInstaller;