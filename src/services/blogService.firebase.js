// blogService pour Firebase Firestore
import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';

const ARTICLES = 'articles';
const COMMENTS = 'comments';

export const blogService = {
  // Get all articles
  async getArticles() {
    const q = query(collection(db, ARTICLES), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get single article
  async getArticle(id) {
    const ref = doc(db, ARTICLES, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Article non trouvé');
    return { id: snap.id, ...snap.data() };
  },

  // Create new article
  async createArticle(data) {
    const docRef = await addDoc(collection(db, ARTICLES), {
      ...data,
      date: new Date().toISOString(),
      views: 0,
    });
    const snap = await getDoc(docRef);
    return { id: snap.id, ...snap.data() };
  },

  // Update article
  async updateArticle(id, data) {
    const ref = doc(db, ARTICLES, id);
    await updateDoc(ref, data);
    const snap = await getDoc(ref);
    return { id: snap.id, ...snap.data() };
  },

  // Delete article
  async deleteArticle(id) {
    await deleteDoc(doc(db, ARTICLES, id));
    return true;
  },

  // Get comments for an article
  async getComments(articleId) {
    const q = query(collection(db, ARTICLES, articleId, COMMENTS), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Add comment to an article
  async addComment(articleId, data) {
    const docRef = await addDoc(collection(db, ARTICLES, articleId, COMMENTS), {
      ...data,
      date: new Date().toISOString(),
    });
    const snap = await getDoc(docRef);
    return { id: snap.id, ...snap.data() };
  },

  // Delete comment
  async deleteComment(articleId, commentId) {
    await deleteDoc(doc(db, ARTICLES, articleId, COMMENTS, commentId));
    return true;
  },

  // Increment view count
  async incrementViews(articleId) {
    const ref = doc(db, ARTICLES, articleId);
    await updateDoc(ref, { views: (await getDoc(ref)).data().views + 1 });
    const snap = await getDoc(ref);
    return { views: snap.data().views };
  },
};
