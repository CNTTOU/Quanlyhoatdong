import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  writeBatch,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const identityFirebaseConfig = {
  apiKey: process.env.VITE_IDENTITY_FIREBASE_API_KEY,
  authDomain: process.env.VITE_IDENTITY_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_IDENTITY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_IDENTITY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_IDENTITY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_IDENTITY_FIREBASE_APP_ID,
};

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env.");
  process.exit(1);
}

const identityApp = initializeApp(identityFirebaseConfig);
const app = initializeApp(firebaseConfig, "activity");
const auth = getAuth(app);
const db = getFirestore(app);
const identityDb = getFirestore(identityApp);

function buildAncestorIds(units, unitId) {
  const byId = new Map(units.map((unit) => [unit.ma_don_vi, unit]));
  const result = [];
  const seen = new Set();
  let currentId = unitId;

  while (currentId && !seen.has(currentId)) {
    seen.add(currentId);
    result.push(currentId);
    currentId = String(byId.get(currentId)?.ma_don_vi_cha || "");
  }

  return result;
}

async function commitInChunks(updates) {
  let total = 0;
  for (let index = 0; index < updates.length; index += 450) {
    const batch = writeBatch(db);
    updates.slice(index, index + 450).forEach(({ ref, data }) => batch.update(ref, data));
    await batch.commit();
    total += updates.slice(index, index + 450).length;
  }
  return total;
}

async function backfillCollection(collectionName, units) {
  const snap = await getDocs(collection(db, collectionName));
  const updates = [];

  snap.docs.forEach((item) => {
    const data = item.data();
    const unitId = String(data.ma_don_vi || "");
    if (!unitId) return;

    const pathIds = buildAncestorIds(units, unitId);
    if (!pathIds.length) return;

    const currentPath = Array.isArray(data.don_vi_path_ids)
      ? data.don_vi_path_ids.map(String)
      : [];
    if (currentPath.join("|") === pathIds.join("|")) return;

    updates.push({
      ref: doc(db, collectionName, item.id),
      data: { don_vi_path_ids: pathIds },
    });
  });

  return commitInChunks(updates);
}

async function main() {
  await signInWithEmailAndPassword(auth, email, password);

  const unitSnap = await getDocs(collection(identityDb, "don_vi"));
  const units = unitSnap.docs.map((item) => ({ ma_don_vi: item.id, ...item.data() }));

  const [activityCount, evidenceCount] = await Promise.all([
    backfillCollection("hoat_dong", units),
    backfillCollection("minh_chung", units),
  ]);

  await signOut(auth);
  console.log(`Updated ${activityCount} activities and ${evidenceCount} evidences.`);
}

main().catch(async (error) => {
  console.error(error);
  await signOut(auth).catch(() => undefined);
  process.exit(1);
});
