import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

if (!fs.existsSync(path.resolve('.env'))) {
  console.error('[Basic-Auth] Missing ".env" file'.red);
  process.exit(1);
}

spawn('ts-node-dev', ['./index.ts', '— respawn — pretty — transpile-only'], { stdio: 'inherit' });
