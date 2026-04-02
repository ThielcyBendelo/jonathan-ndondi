// newsletterService pour Firebase Firestore
import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
} from 'firebase/firestore';

const SUBSCRIBERS = 'subscribers';

export const newsletterService = {
  // Get all subscribers
  async getSubscribers() {
    const snap = await getDocs(collection(db, SUBSCRIBERS));
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // Add subscriber
  async addSubscriber(email) {
    const q = query(collection(db, SUBSCRIBERS));
    const snap = await getDocs(q);
    if (snap.docs.find((doc) => doc.data().email === email)) {
      throw new Error('Email déjà abonné');
    }
    const docRef = await addDoc(collection(db, SUBSCRIBERS), {
      email,
      subscribedAt: new Date().toISOString(),
      status: 'actif',
    });
    return { id: docRef.id, email, status: 'actif' };
  },

  // Delete subscriber
  async deleteSubscriber(id) {
    await deleteDoc(doc(db, SUBSCRIBERS, id));
    return true;
  },
};
