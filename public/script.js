const app_name = "Unreliable Pod "
var header = document.getElementsByClassName('app-title');
const red='#DC4C64'
const green='#14A44D'
fetch('name')
    .then(res => {
        if (res.ok) {
            // Parse the response as JSON
            return res.json();
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .then(data => {
        // Update the text content of the header
        header[0].textContent = app_name + `(${data.name})`;
    })
    .catch(err => {
        // Log the error or handle it appropriately
        header[0].textContent = app_name + 'Unavailable';
        console.error('There was a problem with the fetch operation:', err);
    });

for (let i = 1; i <= 9; i++) {
    let box = document.getElementById(`box-${i}`);
    let modal = document.getElementById(`dialog-${i}`);
    if (!box || !modal) {
        continue;
    }
    box.addEventListener('click', () => modal.showModal());
    document.addEventListener('click', ({ target }) => target === modal && modal.close());
}

function stress() {
    let cores = document.getElementById('cores').value;
    let duration = document.getElementById('stress-duration').value || 10;
    fetch('stress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cores: cores, duration: duration })
    }).then(res => {
        if (res.ok) {
            // Parse the response as JSON
            return res.text();
        } else {
            throw new Error('Network response was not ok');
        }
    }).then(data => {
        const stressOut = `Stressing ${cores || 'all'} cores for ${duration} seconds.`
        const stresscontent = document.getElementById('stress-output');
        stresscontent.innerText = stressOut;
        stresscontent.style.color=green;
    }).catch(err => {
        const stresscontent = document.getElementById('stress-output');
        stresscontent.innerText = "Failed to stress"
        stresscontent.style.color=red;
        console.log(err)
    })
}

function setHealth() {
    let status = document.getElementById('status').value;
    let duration = document.getElementById('status-id').value;
    console.log(status)
    fetch('health', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: status, duration: duration })
    }).then(res => {
        if (res.ok) {
            // Parse the response as JSON
            return res;
        } else {
            throw new Error('Network response was not ok');
        }
    }).then(data => {
        const healthOut = document.getElementById('health-output');
        if (duration) {
            healthOut.innerText = `Pod health is now ${status} for ${duration} seconds`
        } else {
            healthOut.innerText = `Pod health is changed to ${status}`
        }
        healthOut.style.color=green
    }).catch(err => {
        const healthOut = document.getElementById('health-output');
        healthOut.innerText = "Unable to change health status"
        healthOut.style.color=red
    })
}

function freeze() {
    let duration = document.getElementById('freeze-duration').value||10;
    fetch('freeze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ duration: duration })
    }).then(res => {
        if (res.ok) {
            // Parse the response as JSON
            return res;
        } else {
            throw new Error('Network response was not ok');
        }
    }).then(data => {
        const freezeOutput = document.getElementById('freeze-output');
        freezeOutput.innerText = `Pod is freezed for ${duration} seconds`
        freezeOutput.style.color=green
    }).catch(err => {
        const freezeOutput = document.getElementById('freeze-output');
        freezeOutput.innerText = `Failed to freeze pod`
        freezeOutput.style.color=red
    })
}

function shutdown() {
    let after = document.getElementById('shutdown-after').value || 10;
    let exitCode = document.getElementById('exit-code').value || 0;
    fetch('close', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ after: after,exitCode: exitCode })
    }).then(res => {
        if (res.ok) {
            // Parse the response as JSON
            return res;
        } else {
            throw new Error('Network response was not ok');
        }
    }).then(data => {
        const shutdownOutput = document.getElementById('shutdown-output');
        shutdownOutput.innerText = `Pod will shutdown after ${after} seconds`
        shutdownOutput.style.color=green
    }).catch(err => {
        const shutdownOutput = document.getElementById('shutdown-output');
        shutdownOutput.innerText = `Failed to shutdown pod`
        shutdownOutput.style.color=red
    })
}

function writeMessage() {
    let path = document.getElementById('write-directory').value || '/tmp';
    fetch('write', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: path })
    }).then(res => {
        if (res.ok) {
            // Parse the response as JSON
            return res;
        } else {
            throw new Error('Network response was not ok');
        }
    }).then(data => {
        const writeOutput = document.getElementById('write-output');
        writeOutput.innerText = `Written some text to '${path}' this path`
        writeOutput.style.color=green
    }).catch(err => {
        const writeOutput = document.getElementById('write-output');
        writeOutput.innerText = `Unable to write text to '${path}' this path`
        writeOutput.style.color=red
    }).finally(data => {
    })
}

function readMessage() {
    let path = document.getElementById('read-directory').value || '/tmp';
    fetch(`read?path=${path}`).then(res => {
        if (res.ok) {
            return res.text();
        } else {
            throw new Error('Network response was not ok');
        }
    }).then(data => {
        const readOutput = document.getElementById('read-output');
        readOutput.innerText = `Read '${data}' from ${path} path`
        readOutput.style.color=green
    }).catch(err => {
        const readOutput = document.getElementById('read-output');
        readOutput.innerText = `Unable to read data from ${path} path`
        readOutput.style.color=red
    })
}

function dos() {
    let duration = document.getElementById('dos-duration').value || 10;
    let url = document.getElementById('dos-url').value || 'localhost';
    fetch('concurrent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url, duration: duration })
    }).then(res => {
        if (res.ok) {
            return res.text();
        } else {
            throw new Error('Network response was not ok');
        }
    }).then(data => {
        const dosOutput = document.getElementById('dos-output');
        dosOutput.innerText = `Started DoS for ${duration} seconds`
        dosOutput.style.color=green
    }).catch(err => {
        const dosOutput = document.getElementById('dos-output')
        dosOutput.innerText = "Unable to perform DoS"
        dosOutput.style.color=red
        console.error(err)
    })
}
function logFlood() {
    let duration = document.getElementById('log-duration').value || 10;
    let level = document.getElementById('log-status').value;
    console.log(level);
    fetch('logs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ duration: duration, level: level })
    }).then(res => {
        if (res.ok) {
            return res.text();
        } else {
            throw new Error('Network response was not ok');
        }
    }).then(data => {
        const logFloodOutput = document.getElementById('log-output');
        logFloodOutput.innerText = `Started Log Flood for ${duration} seconds`
        logFloodOutput.style.color=green
    }).catch(err => {
        const logFloodOutput = document.getElementById('log-output');
        logFloodOutput.innerText = "Unable to perform Log Flood"
        logFloodOutput.style.color=red
        console.error(err)
    })
}