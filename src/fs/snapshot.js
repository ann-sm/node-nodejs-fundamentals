import { promises as fs } from 'fs'; 
import path from 'path'; 
import { fileURLToPath } from 'url';

const snapshot = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const workspaceDir = path.resolve(__dirname, '../../workspace');

  try {
    await fs.access(workspaceDir);
    
    const rootPath = path.resolve(workspaceDir);
    const entries = [];

    const scanDir = async (dir) => {
      const files = await fs.readdir(dir, { withFileTypes: true });
  
      for (const file of files) {
        const filePath = path.join(dir, file.name);
        const relativePath = path.relative(workspaceDir, filePath);
  
        if (file.isDirectory()) {
          entries.push({ 
            path: relativePath, 
            type: 'directory' });

          await scanDir(filePath);

        } else  {
          const stats = await fs.stat(filePath);
          const content = await fs.readFile(filePath);
  
          entries.push({ 
            path: relativePath, 
            type: 'file',
            size: stats.size,
            content: content.toString('base64'),
          });
        }
      }
    }

    await scanDir(workspaceDir);

    const snapshotData = {
      rootPath,
      entries
    };

    const snapshotPath = path.resolve(__dirname, '../../snapshot.json');
    await fs.writeFile(snapshotPath, JSON.stringify(snapshotData, null, 2));
  }
  catch {
    console.error('FS operation failed');
  }
};

await snapshot();
