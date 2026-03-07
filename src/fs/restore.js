import { promises as fs } from 'fs'; 
import path from 'path'; 
import { fileURLToPath } from 'url';

const restore = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const snapshotPath = path.resolve(__dirname, "../../snapshot.json");
  const restoreDir = path.resolve(__dirname, "../../workspace_restored");

  try {
    await fs.access(snapshotPath);

    try {
      await fs.access(restoreDir);
      throw new Error();
    }
    catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    const snapshotFile= await fs.readFile(snapshotPath, "utf-8");
    const snapshot = JSON.parse(snapshotFile);

    await fs.mkdir(restoreDir);

    for (const entry of snapshot.entries) {
      const entryPath = path.join(restoreDir, entry.path);

      if (entry.type === 'directory') {
        await fs.mkdir(entryPath, { recursive: true });
      } else if (entry.type === 'file') {
        const contentBuffer = Buffer.from(entry.content, 'base64');
        await fs.writeFile(entryPath, contentBuffer);
      }
    }
  }
  catch {
    console.error('FS operation failed');
  }
};

await restore();
