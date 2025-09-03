
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, ActionCodeSettings } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "habitual-f8gf7",
  "appId": "1:897900127150:web:87668fc7d777ec546f1e3f",
  "storageBucket": "habitual-f8gf7.firebasestorage.app",
  "apiKey": "AIzaSyAePFU6m-dvx3DaClpnLoitTfXerF3tJSs",
  "authDomain": "habitual-f8gf7.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "897900127150"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize App Check
if (typeof window !== 'undefined') {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!),
    isTokenAutoRefreshEnabled: true
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);

export const actionCodeSettings: ActionCodeSettings = {
    // Make sure the URL is the one for your deployed app
    url: 'https://habitual-f8gf7.web.app/auth/action', 
    handleCodeInApp: true,
};
