// db.js
const DB_NAME = 'GameTrackerDB';
const STORE_NAME = 'gamesData';
const DB_VERSION = 1;

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject('Error opening IndexedDB');
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function getItem(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject('Failed to retrieve data');
  });
}

export async function setItem(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(value, key);

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject('Failed to save data');
  });
}

export async function removeItem(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(key);

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject('Failed to remove data');
  });
}
