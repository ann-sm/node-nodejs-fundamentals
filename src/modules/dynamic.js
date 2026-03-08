import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const dynamic = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const args = process.argv.slice(2);
  const pluginName = args[0];

  try {
    const pluginPath = path.resolve(__dirname, '../modules/plugins', `${pluginName}.js`);
    const module = await import(pathToFileURL(pluginPath));

    const result = module.run();
    console.log(result);

  } catch {
    console.log('Plugin not found');
    process.exit(1);
  }
};

await dynamic();
