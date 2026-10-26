// IndexedDB Audio Storage Manager for Chapter Audiobooks
// Allows author to upload MP3/WAV/M4A audio files for any story/chapter and persist them locally.

const DB_NAME = 'NishatAudiobooksDB';
const STORE_NAME = 'chapter_audio';

function openAudioDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'chapterKey' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveChapterAudio(chapterKey: string, fileBlob: Blob, fileName: string): Promise<void> {
  const db = await openAudioDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const item = {
      chapterKey,
      fileBlob,
      fileName,
      updatedAt: Date.now()
    };
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getChapterAudio(chapterKey: string): Promise<{ blobUrl: string; fileName: string } | null> {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(chapterKey);
      req.onsuccess = () => {
        if (req.result && req.result.fileBlob) {
          const blobUrl = URL.createObjectURL(req.result.fileBlob);
          resolve({ blobUrl, fileName: req.result.fileName });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function deleteChapterAudio(chapterKey: string): Promise<void> {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(chapterKey);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Ignore
  }
}
