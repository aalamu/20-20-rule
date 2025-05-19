/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  if (data.command === 'start') {
    const startTime = Date.now();
    const duration = data.duration * 1000; // Duration in milliseconds
    const checkTime = () => {
      const elapsed = Date.now() - startTime;
      const timeLeft = Math.max(0, duration - elapsed);
      postMessage({ timeLeft: Math.floor(timeLeft / 1000) });
      if (timeLeft > 0) {
        setTimeout(checkTime, 1000);
      } else {
        postMessage('done');
      }
    };
    checkTime();
  }
});
