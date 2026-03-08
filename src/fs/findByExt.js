import { promises as fs } from 'fs'; 
import path from 'path'; 
import { fileURLToPath } from 'url';

const findByExt = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const workspaceDir = path.resolve(__dirname, '../../workspace');

  try {
    await fs.access(workspaceDir);

    const paths = [];

    const args = process.argv;
    const ext = args.slice(args.findIndex(arg => arg.startsWith('--ext')) + 1)[0] || 'txt';

    const scanDir = async (dir) => {
      const files = await fs.readdir(dir, { withFileTypes: true });
  
      for (const file of files) {
        const filePath = path.join(dir, file.name);
  
        if (file.isDirectory()) {
          await scanDir(filePath);
        } else if (path.extname(file.name) === `.${ext}`) {
          paths.push(path.relative(workspaceDir, filePath));
        }
      }
    }
    
    await scanDir(workspaceDir);

    console.log(paths.sort((a, b) => a.localeCompare(b)).join('\n'));
  } 
  catch {
    console.error('FS operation failed');
    return;
  }
};

await findByExt();
