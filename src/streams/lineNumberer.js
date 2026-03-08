import { Transform } from 'stream';

const lineNumberer = () => {
  let lineNumber = 1;
  let buffer = '';
  let isFirstChunk = true;

  const transformer = new Transform({
    transform(chunk, _, callback) {
      buffer = buffer + chunk.toString();

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (isFirstChunk) {
          this.push('\n');
          isFirstChunk = false;
        }
        this.push(`${lineNumber++} | ${line}\n`);
      }

      callback();
    },

    flush(callback) {
      if (buffer.length > 0) {
        this.push(`${lineNumber++} | ${buffer}\n`);
      }
      callback();
    }
  });
  process.stdin.pipe(transformer).pipe(process.stdout);
};

lineNumberer();