import { spawn } from 'node:child_process';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 5000;
let occupied = false;
try {
  const response = await fetch(`http://localhost:${port}/api/health`, { signal: AbortSignal.timeout(1500) });
  occupied = true;
  const health = await response.json();
  if (health.service !== 'devfolio-pro') throw new Error('Another service is using this port');
  console.log(`Portfolio API is already running on port ${port}. Reusing it; no second backend was started.`);
  await new Promise(resolve => { const timer = setInterval(() => {}, 60000); const stop = () => { clearInterval(timer); resolve(); }; process.once('SIGINT', stop); process.once('SIGTERM', stop); });
} catch (error) {
  if (occupied || error.name === 'TimeoutError') { console.error(`Port ${port} is occupied by an unrecognized or unresponsive service. Stop that service or set PORT and VITE_API_TARGET together.`); process.exitCode = 1; }
  else {
    const child = spawn(process.execPath, ['node_modules/nodemon/bin/nodemon.js', '--watch', 'server', '--watch', '.env', '--ext', 'js,json,env', 'server/server.js'], { stdio: 'inherit' });
    process.once('SIGINT', () => child.kill('SIGINT'));
    process.once('SIGTERM', () => child.kill('SIGTERM'));
    child.once('exit', code => { process.exitCode = code || 0; });
  }
}
