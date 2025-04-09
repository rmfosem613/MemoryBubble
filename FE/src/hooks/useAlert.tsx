// hooks/useAlert.ts
import { useState, useCallback } from 'react';

export interface AlertState {
  visible: boolean;
  message: string;
  color: 'red' | 'green' | 'gray' | 'blue';
}

export const useAlert = () => {
  const [alertState, setAlertState] = useState<AlertState | null>(null);

  const showAlert = useCallback(
    (message: string, color: 'red' | 'green' | 'gray' | 'blue') => {
      setAlertState({ visible: true, message, color });

      // 3초 후에 알림 숨기기
      setTimeout(() => {
        setAlertState(null);
      }, 3000);
    },
    [],
  );

  return {
    alertState,
    showAlert,
  };
};
