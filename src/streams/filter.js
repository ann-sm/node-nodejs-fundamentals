import { Transform } from 'stream';

const filter = () => {
  const patternIndex = process.argv.indexOf('--pattern');
  const pattern = patternIndex !== -1 ? process.argv[patternIndex + 1] : '';

  let buffer = '';
  let isFirstChunk = true;

  const transformer = new Transform({
    
    transform(chunk, _, callback) {
      buffer += chunk.toString();
      
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? '';
      
      
      for (const line of lines) {
        if (line.includes(pattern)) {
          if (isFirstChunk) {
            this.push('\n');
            isFirstChunk = false;
          }
          this.push(line + '\n');
        }
      }

      callback();
    },

    flush(callback) {
      if (buffer && buffer.includes(pattern)) {
        this.push(buffer + '\n');
      }
      callback();
    }
  });

  process.stdin.pipe(transformer).pipe(process.stdout);
};

filter();