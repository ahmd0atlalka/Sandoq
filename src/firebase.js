import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDRgd3GMVxGX2YP6_k7smkjQHEUHvuYSyA",
  authDomain: "sandoq-b1c38.firebaseapp.com",
  databaseURL: "https://sandoq-b1c38-default-rtdb.firebaseio.com",
  projectId: "sandoq-b1c38",
  storageBucket: "sandoq-b1c38.firebasestorage.app",
  messagingSenderId: "491158916729",
  appId: "1:491158916729:web:180fa028ac97d157d68ea8",
  measurementId: "G-Z464Z2VTDP"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const analytics = getAnalytics(app); 