// worker.js
const { parentPort, workerData } = require('worker_threads');

function stressCPU(duration) {
  const end = Date.now() + duration * 1000; 
  while (Date.now() < end) {
    // Busy loop to stress the CPU
  }
  parentPort.postMessage('done');
}

const duration = workerData.duration;
stressCPU(duration);
