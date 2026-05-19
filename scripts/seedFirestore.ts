import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(scriptDir, '..');
const workspaceDir = resolve(projectDir, '..');

function loadEnvFile(filePath: string) {
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

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('Thiếu ADMIN_EMAIL hoặc ADMIN_PASSWORD trong file .env');
  process.exit(1);
}

try {
  const { getAuth, signInWithEmailAndPassword, signOut } = await import('firebase/auth');
  await import('../src/lib/firebase.ts');
  const { seedAll } = await import('../src/services/seedService.ts');

  console.log('Đang đăng nhập bằng tài khoản admin...');
  await signInWithEmailAndPassword(getAuth(), email, password);

  console.log('Đang seed dữ liệu Firestore...');
  await seedAll();

  await signOut(getAuth());
  console.log('Seed Firestore thành công.');
} catch (error) {
  console.error('Seed Firestore thất bại:', error instanceof Error ? error.message : error);
  process.exit(1);
}
