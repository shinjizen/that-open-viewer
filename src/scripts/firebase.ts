import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC9Tis46JDBInSVCO4pjXwByuSeX3GJ1jM",
    authDomain: "that-open-ifc-viewer.firebaseapp.com",
    projectId: "that-open-ifc-viewer",
    storageBucket: "that-open-ifc-viewer.appspot.com",
    messagingSenderId: "249523490161",
    appId: "1:249523490161:web:c38f4a31fb54188ec23ad0",
    measurementId: "G-LCYJC2QSZD"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL };