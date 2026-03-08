const progress = () => {
  const args = process.argv.slice(2);

  let duration = 5000;
  let interval = 100;
  let length = 30;
  let color = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--duration' && args[i + 1]) {
      duration = parseInt(args[i + 1], 10);
    } else if (args[i] === '--interval' && args[i + 1]) {
      interval = parseInt(args[i + 1], 10);
    } else if (args[i] === '--length' && args[i + 1]) {
      length = parseInt(args[i + 1], 10);
    } else if (args[i] === '--color' && args[i + 1]) {
      color = args[i + 1];
    }
  }

  let colorCode = '';
  const colorReset = '\x1b[0m';

  if (color) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    colorCode = `\x1b[38;2;${r};${g};${b}m`;
  }

  const totalSteps = Math.ceil(duration / interval);
  let step = 0;

  const timer = setInterval(() => {
    step++;

    const part = Math.min(step / totalSteps, 1);
    const percent = Math.round(part * 100);

    const filledLength = Math.round(length * part);
    const emptyLength = length - filledLength;

    const filled = '█'.repeat(filledLength);
    const emptyBar = ' '.repeat(emptyLength);

    const filledBar = colorCode ? `${colorCode}${filled}${colorReset}` : filled;
    const progressBar = `[${filledBar}${emptyBar}] ${percent}%`;

    process.stdout.write('\r' + progressBar);

    if (percent >= 100) {
        clearInterval(timer);
        console.log('\nDone!');
      }
  }, interval);
};

progress();
