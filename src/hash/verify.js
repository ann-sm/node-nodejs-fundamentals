import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createReadStream } from 'fs';
import crypto from 'crypto';

const verify = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const checksumsPath = path.resolve(__dirname, '../../checksums.json');

  try {
    await fs.access(checksumsPath);

    const checksumsContent = await fs.readFile(checksumsPath, 'utf-8');
    const checksums = JSON.parse(checksumsContent);

    for (const [fileName, expectedHash] of Object.entries(checksums)) {
      const filePath = path.resolve(__dirname, '../../', fileName);

      const hash = crypto.createHash('sha256');
      const stream = createReadStream(filePath);

      await new Promise((resolve, reject) => {
        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('end', resolve);
        stream.on('error', reject);
      });

      const actualHash = hash.digest('hex');

      if (actualHash === expectedHash) {
        console.log(`${fileName} — OK`);
      } else {
        console.log(`${fileName} — FAIL`);
      }
    }
    
  } catch {
    // console.error('FS operation failed');
    throw new Error('FS operation failed');
  }
};

await verify();
