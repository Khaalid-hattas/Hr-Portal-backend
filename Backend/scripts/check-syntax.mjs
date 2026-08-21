import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const roots = ['server.js', 'config', 'Controllers', 'models', 'Routes'];

function javascriptFiles(entry) {
  const absolutePath = path.resolve(entry);
  if (statSync(absolutePath).isFile()) return [absolutePath];

  return readdirSync(absolutePath, { withFileTypes: true }).flatMap((child) => {
    const childPath = path.join(absolutePath, child.name);
    return child.isDirectory() ? javascriptFiles(childPath) : child.name.endsWith('.js') ? [childPath] : [];
  });
}

for (const file of roots.flatMap(javascriptFiles)) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}

console.log('Backend JavaScript syntax check passed.');
