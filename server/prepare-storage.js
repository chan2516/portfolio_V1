// Runs only in the one-shot root storage initializer, never in the web service.
import { mkdir, lstat, readdir, chown, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

const root = '/data';
await mkdir(root, { recursive: true });
await mkdir(path.join(root, 'uploads'), { recursive: true });
async function prepare(target) {
  const stat = await lstat(target);
  if (stat.isSymbolicLink()) throw new Error(`Refusing symbolic link in application storage: ${target}`);
  await chown(target, 1000, 1000);
  if (stat.isDirectory()) for (const name of await readdir(target)) await prepare(path.join(target, name));
}
await prepare(root);
await access(root, constants.W_OK);
console.log('Application storage ownership prepared for UID/GID 1000:1000.');
