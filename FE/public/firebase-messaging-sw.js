// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/11.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.5.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyB8zfu-jFjdPs154Ce1a1_0k-X9Hy-eC3M",
  projectId: "memorybubble-b55e0",
  messagingSenderId: "24204537613",
  appId: "1:24204537613:web:aa391805265dc649bb0a44",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background Message received: ', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // 알림 아이콘 설정
  });
});