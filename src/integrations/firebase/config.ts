import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCZBRX5UCvpLfvrDxR3ozT2H-ax-vwM6AM",
  authDomain: "rd-loca-facil.firebaseapp.com",
  projectId: "rd-loca-facil",
  storageBucket: "rd-loca-facil.firebasestorage.app",
  messagingSenderId: "816532948386",
  appId: "1:816532948386:web:333b87c14607e683c09efb",
  measurementId: "G-RF4EHH79FW"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);