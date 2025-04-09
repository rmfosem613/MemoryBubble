import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";
import apiClient from '@/apis/apiClient.ts';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const messaging: Messaging = getMessaging(app);

// FCM 토큰 요청 함수
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    // const currentPermission = Notification.permission;

    // 이미 거부된 상태인 경우
    /* if (currentPermission === 'denied') {
      // 사용자에게 브라우저 설정에서 권한을 변경하도록 안내 메시지 표시
      alert('알림 권한이 거부되었습니다. 브라우저 설정에서 변경해주세요.');
      return null;
    }*/
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      if (token) {
        console.log('FCM 토큰:', token);
        await apiClient.post('/api/fcm', {
          token: token
        })
        return token;
      }
    }
    return null;
  } catch (error) {
    console.error('Notification permission error:', error);
    return null;
  }
};

// 포그라운드 메시지 수신 핸들러
export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};