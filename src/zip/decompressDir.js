import { promises as fs } from 'fs';
import { createReadStream } from 'fs';
import { createBrotliDecompress } from 'zlib';
import path from 'path';
import { fileURLToPath } from 'url';

const decompressDir = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const workspaceDir = path.resolve(__dirname, '../../workspace');
  const compressedDir = path.join(workspaceDir, 'compressed');
  const archivePath = path.join(compressedDir, 'archive.br');
  const outputDir = path.join(workspaceDir, 'decompressed');

  try {
    await fs.access(compressedDir);
    await fs.access(archivePath);

    await fs.mkdir(outputDir, { recursive: true });

    const stream = createReadStream(archivePath).pipe(createBrotliDecompress());

    let data = '';

    await new Promise((resolve, reject) => {
      stream.on('data', chunk => data += chunk.toString());
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    const { files } = JSON.parse(data);

    for (const file of files) {
      const targetPath = path.join(outputDir, file.path);

      await fs.mkdir(path.dirname(targetPath), { recursive: true });

      const buffer = Buffer.from(file.content, 'base64');
      await fs.writeFile(targetPath, buffer);
    }

  } catch {
    throw new Error('FS operation failed');
  }
};

await decompressDir();
