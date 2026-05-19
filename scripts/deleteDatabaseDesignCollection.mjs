import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(scriptDir, '..');
const workspaceDir = resolve(projectDir, '..');

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(resolve(workspaceDir, '.env'));
loadEnvFile(resolve(projectDir, '.env'));

try {
  const { db } = await import('../src/lib/firebase.ts');
  const snapshot = await getDocs(collection(db, 'thiet_ke_csdl'));

  await Promise.all(snapshot.docs.map((item) => deleteDoc(doc(db, 'thiet_ke_csdl', item.id))));

  console.log(`Đã xóa ${snapshot.size} document trong collection thiet_ke_csdl.`);
} catch (error) {
  console.error('Xóa collection thiet_ke_csdl thất bại:', error instanceof Error ? error.message : error);
  process.exit(1);
}
