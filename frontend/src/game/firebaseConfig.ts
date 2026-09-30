/**
 * Cấu hình Firebase web (công khai, không phải secret máy chủ).
 * Dán object từ Firebase console vào `pasted`, hoặc đặt biến VITE_FIREBASE_* (ưu tiên hơn).
 * Để trống thì bảng thời gian thực tắt; bảng trên máy này vẫn dùng được.
 */
const pasted = {
  apiKey: "AIzaSyCSztlvpSMVaMYMveW6RZQplm6FBBxFfIw",
  authDomain: "dai-doan-ket-quiz.firebaseapp.com",
  databaseURL: "https://dai-doan-ket-quiz-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dai-doan-ket-quiz",
  storageBucket: "dai-doan-ket-quiz.firebasestorage.app",
  messagingSenderId: "881305264085",
  appId: "1:881305264085:web:c85b0d5a63ea102667a75c",
};

function pick(envValue: string | undefined, fallback: string): string {
  const fromEnv = envValue?.trim();
  if (fromEnv) return fromEnv;
  return fallback.trim();
}

export const firebaseConfig = {
  apiKey: pick(import.meta.env.VITE_FIREBASE_API_KEY, pasted.apiKey),
  authDomain: pick(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, pasted.authDomain),
  databaseURL: pick(import.meta.env.VITE_FIREBASE_DATABASE_URL, pasted.databaseURL),
  projectId: pick(import.meta.env.VITE_FIREBASE_PROJECT_ID, pasted.projectId),
  storageBucket: pick(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, pasted.storageBucket),
  messagingSenderId: pick(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, pasted.messagingSenderId),
  appId: pick(import.meta.env.VITE_FIREBASE_APP_ID, pasted.appId),
};

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.databaseURL && firebaseConfig.projectId);
}
