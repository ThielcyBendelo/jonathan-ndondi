// Service d’authentification et gestion des rôles avec Firebase
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const app = initializeApp({
  /* voir firebase.js pour config */
});
const auth = getAuth(app);

export const authService = {
  signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  },
  signOut() {
    return signOut(auth);
  },
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },
  async getUserRole(uid) {
    // Récupère le rôle depuis Firestore (collection users, champ role)
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data().role : 'reader';
  },
};
