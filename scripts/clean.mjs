import fs from 'node:fs';
for (const dir of ['dist', 'build', '.tmp-tests']) {
  fs.rmSync(dir, { recursive: true, force: true });
}
