import { initializeApp} from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBv0QMc1KlH_e8_9l_LqxEcmuT48_-8aAY",
  authDomain: "condohelp-ee1c2.firebaseapp.com",
  projectId: "condohelp-ee1c2",
  storageBucket: "condohelp-ee1c2.appspot.com",
  messagingSenderId: "761749792174",
  appId: "1:761749792174:web:d0456d81fbb66b914b943f"
};

const firebaseApp = initializeApp(firebaseConfig);
export const storage =  getStorage(firebaseApp);