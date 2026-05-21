import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_IDENTITY_FIREBASE_API_KEY,
  authDomain: process.env.VITE_IDENTITY_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_IDENTITY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_IDENTITY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_IDENTITY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_IDENTITY_FIREBASE_APP_ID,
};

const unitTypes = [
  { ma_loai: 'doan_khoa', ten_loai: 'Đoàn khoa', trang_thai: 'dang_hoat_dong' },
  { ma_loai: 'lien_chi_hoi', ten_loai: 'Liên chi Hội khoa', trang_thai: 'dang_hoat_dong' },
  { ma_loai: 'chi_doan', ten_loai: 'Chi đoàn', trang_thai: 'dang_hoat_dong' },
  { ma_loai: 'chi_hoi', ten_loai: 'Chi hội', trang_thai: 'dang_hoat_dong' },
  { ma_loai: 'cau_lac_bo', ten_loai: 'Câu lạc bộ', trang_thai: 'dang_hoat_dong' },
  { ma_loai: 'doi_nhom', ten_loai: 'Đội / Nhóm', trang_thai: 'dang_hoat_dong' },
];

function assertConfig() {
  const missingKeys = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(`Thiếu cấu hình Firebase: ${missingKeys.join(', ')}`);
  }

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('Thiếu ADMIN_EMAIL hoặc ADMIN_PASSWORD trong file .env.');
  }
}

async function seedUnitTypes() {
  assertConfig();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  await signInWithEmailAndPassword(auth, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

  for (const unitType of unitTypes) {
    await setDoc(
      doc(db, 'loai_don_vi', unitType.ma_loai),
      {
        ...unitType,
        ngay_tao: serverTimestamp(),
        ngay_cap_nhat: serverTimestamp(),
      },
      { merge: true },
    );
    console.log(`Đã seed loại đơn vị: ${unitType.ma_loai}`);
  }

  await signOut(auth);
  console.log('Seed loai_don_vi hoàn tất.');
}

seedUnitTypes().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
