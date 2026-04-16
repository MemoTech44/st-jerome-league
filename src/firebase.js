import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz1TUCBKPspkCDEcOUXC3xN4CoX36VDMA",
  authDomain: "st-jerome-league.firebaseapp.com",
  projectId: "st-jerome-league",
  storageBucket: "st-jerome-league.firebasestorage.app",
  messagingSenderId: "429633017658",
  appId: "1:429633017658:web:b5fc4a2ed94c3db5772203",
  measurementId: "G-KBRNECM63N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export services to be used in your components
export { auth, db, storage, analytics };