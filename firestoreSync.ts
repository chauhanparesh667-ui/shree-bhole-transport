import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export const COLLECTIONS = {
  operators: 'operators',
  vehicles: 'vehicles',
  parties: 'parties',
  trips: 'trips',
  expenses: 'expenses',
  activityLogs: 'activityLogs',
  ledger: 'ledger',
  rateRules: 'rateRules',
  dieselExpenses: 'dieselExpenses',
  otherExpenses: 'otherExpenses',
};

export async function fetchCollection<T>(collectionName: string): Promise<T[] | null> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    if (querySnapshot.empty) return null;
    const items: T[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as unknown as T);
    });
    return items;
  } catch (error) {
    console.error(`Error loading ${collectionName} from Firestore:`, error);
    return null;
  }
}

export async function saveToFirestore<T extends { id?: string; username?: string }>(collectionName: string, item: T) {
  try {
    const docId = String(item.id || item.username || `item-${Date.now()}`);
    await setDoc(doc(db, collectionName, docId), item, { merge: true });
  } catch (error) {
    console.error(`Error saving to Firestore (${collectionName}):`, error);
  }
}

export async function removeFromFirestore(collectionName: string, id: string) {
  try {
    await deleteDoc(doc(db, collectionName, String(id)));
  } catch (error) {
    console.error(`Error deleting from Firestore (${collectionName}):`, error);
  }
}

export async function batchSaveToFirestore<T extends { id?: string; username?: string }>(collectionName: string, items: T[]) {
  try {
    for (const item of items) {
      const docId = String(item.id || item.username || `item-${Date.now()}`);
      await setDoc(doc(db, collectionName, docId), item, { merge: true });
    }
  } catch (error) {
    console.error(`Error batch saving to Firestore (${collectionName}):`, error);
  }
}
