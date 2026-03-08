import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const split = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const sourcePath = path.resolve(__dirname, '../../source.txt');

  const args = process.argv;
  const maxLines = Number(args.slice(args.findIndex(arg => arg.startsWith('--lines')) + 1)[0]) || 10;

  let buffer = '';
  let lineCount = 0;
  let chunkIndex = 1;

  let writer = createWriteStream(`chunk_${chunkIndex}.txt`);

  const reader = createReadStream(sourcePath);

  reader.on('data', (chunk) => {
    buffer += chunk.toString();

    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (lineCount >= maxLines) {
        writer.end();
        chunkIndex++;
        writer = createWriteStream(`chunk_${chunkIndex}.txt`);
        lineCount = 0;
      }

      writer.write(line + '\n');
      lineCount++;
    }
  });

  reader.on('end', () => {
    if (buffer) {
      writer.write(buffer + '\n');
    }
    writer.end();
  });
};

await split();
