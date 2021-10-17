import child_process  from 'child_process';
import fs from 'fs';
import path from 'path';
import colors from 'colors';

if (!fs.existsSync(path.resolve('.env'))) {
  console.error('[Basic-Auth] Missing ".env" file'.red);
  process.exit(1);
}

const subprocess = child_process.spawn('./node_modules/.bin/nodemon', ['./index.js', '-q'], { stdio: 'inherit' });
