import { promises as fs } from 'fs'; 
import path from 'path'; 
import { fileURLToPath } from 'url';

const merge = async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
  
    const workspaceDir = path.resolve(__dirname, '../../workspace');
    const partsDir = path.join(workspaceDir, "parts");
    const outputFile = path.join(workspaceDir, "merged.txt");

    try {
      await fs.access(partsDir);

      const files = await fs.readdir(partsDir);

      const args = process.argv;
      const filesIndex = args.indexOf("--files");

      let filesList = [];

      if (filesIndex !== -1 && args[filesIndex + 1]) {
        filesList = args.slice(filesIndex + 1).join().split(',').map(file => file.trim()).filter(file => path.extname(file));
      } else {
        filesList = files.filter(file => path.extname(file) === '.txt').sort();
      }

      let mergedContent = '';

      for (const file of filesList) {
        const filePath = path.join(partsDir, file);

        try {
          if (path.extname(file) !== '.txt') {
            throw new Error;
          }
          const content = await fs.readFile(filePath, 'utf-8');
          mergedContent = `${mergedContent}\n${content}`;
        } 
        catch {
          throw new Error;
        }
      }
      await fs.writeFile(outputFile, mergedContent);
    }
    catch {
      console.error('FS operation failed');
     }
};

await merge();
