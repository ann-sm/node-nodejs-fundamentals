import { promises as fs } from 'fs';
import { createWriteStream } from 'fs';
import { createBrotliCompress } from 'zlib';
import { Readable } from 'stream';
import path from 'path';
import { fileURLToPath } from 'url';

const compressDir = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const workspaceDir = path.resolve(__dirname, '../../workspace');
  const sourceDir = path.join(workspaceDir, 'toCompress');
  const outputDir = path.join(workspaceDir, 'compressed');
  const archivePath = path.join(outputDir, 'archive.br');

  try {
    await fs.access(sourceDir);
    await fs.mkdir(outputDir, { recursive: true });

    const files = [];

    const scan = async (dir) => {
      const items = await fs.readdir(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const relativePath = path.relative(sourceDir, fullPath).replace(/\\/g, '/');

        if (item.isDirectory()) {
          await scan(fullPath);
        } else {
          const content = await fs.readFile(fullPath, 'base64');

          files.push({
            path: relativePath,
            content
          });
        }
      }
    };

    await scan(sourceDir);

    const json = JSON.stringify({ files });

    const readable = Readable.from([json]);
    const compressor = createBrotliCompress();
    const writable = createWriteStream(archivePath);

    readable.pipe(compressor).pipe(writable);

  } catch {
    throw new Error('FS operation failed');
  }
};

await compressDir();
