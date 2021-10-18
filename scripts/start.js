import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import colors from 'colors';

if (!fs.existsSync(path.resolve('.env'))) {
  console.error('[Basic-Auth] Missing ".env" file'.red);
  process.exit(1);
}

spawn('./node_modules/.bin/nodemon', ['./index.js', '-q'], { stdio: 'inherit' });
