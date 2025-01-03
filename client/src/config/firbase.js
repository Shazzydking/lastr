import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyC8nuU0yRwBWW8jb14cj6Pbj5CDMySd9Yo",
    authDomain: "expense-tracker-bb084.firebaseapp.com",
    projectId: "expense-tracker-bb084",
    storageBucket: "expense-tracker-bb084.firebasestorage.app",
    messagingSenderId: "369907142091",
    appId: "1:369907142091:web:12b2f4beea8e7eb58d3a4e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();