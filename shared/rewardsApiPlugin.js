import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'published-rewards.json');
const MAX_BYTES = 1_500_000;

function readCatalog() {
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

/** Dev catalog both portals read. Admin publishes; the recipient shop claims. */
export function publishedRewardsPlugin() {
  return {
    name: 'published-rewards',
    configureServer(server) {
      server.middlewares.use('/api/published-rewards', (req, res, next) => {
        if (req.method === 'GET') {
          send(res, 200, readCatalog());
          return;
        }

        if (req.method !== 'POST') {
          next();
          return;
        }

        const chunks = [];
        let size = 0;
        let rejected = false;

        req.on('data', (chunk) => {
          size += chunk.length;
          if (size > MAX_BYTES) {
            rejected = true;
            send(res, 413, { error: 'That image is too large. Use one under 1 MB.' });
            req.destroy();
            return;
          }
          chunks.push(chunk);
        });

        req.on('end', () => {
          if (rejected || res.writableEnded) return;
          try {
            const reward = JSON.parse(Buffer.concat(chunks).toString('utf8'));
            if (!reward || typeof reward.id !== 'string' || !reward.network) {
              send(res, 400, { error: 'Invalid reward.' });
              return;
            }
            const current = readCatalog().filter((item) => item.id !== reward.id);
            current.unshift(reward);
            fs.writeFileSync(file, JSON.stringify(current, null, 2));
            send(res, 200, { ok: true });
          } catch {
            send(res, 400, { error: 'Invalid reward.' });
          }
        });
      });
    },
  };
}
