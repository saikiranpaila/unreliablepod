const app_name = "Unreliable Pod "
var header = document.getElementsByClassName('app-title');
fetch('/name')
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
    fetch('/stress', {
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
        const stresscontent=document.getElementById('stress-output');
        stresscontent.innerText=stressOut;
    }).catch(err => { console.log(err) })
}

function setHealth() {
    let status = document.getElementById('status').value;
    console.log(status)
    fetch('/health', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: status })
    }).then(res => {
        if (res.ok) {
            // Parse the response as JSON
            return res.json();
        } else {
            throw new Error('Network response was not ok');
        }
    }).then(data => {
    }).catch(err => { }).finally(data=>{
        const healthOut=document.getElementById('health-output');
        healthOut.innerText=`Pod health is changed to ${status}`
    })
}

function freeze() {
    let duration = document.getElementById('freeze-duration').value;
    fetch('/freeze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ duration: duration })
    }).then(res => {
        if (res.ok) {
            // Parse the response as JSON
            return res.json();
        } else {
            throw new Error('Network response was not ok');
        }
    }).then(data => {
        
    }).catch(err => { }).finally(data=>{
        const freezeOutput=document.getElementById('freeze-output');
        freezeOutput.innerText=`Pod is freezed for ${duration} seconds`
    })
}

function shutdown() {
    let after = document.getElementById('shutdown-after').value||10;
    fetch('/close', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ after: after })
    }).then(res => {
        if (res.ok) {
            // Parse the response as JSON
            return res.json();
        } else {
            throw new Error('Network response was not ok');
        }
    }).then(data => {
    }).catch(err => { }).finally(data=>{
        const shutdownOutput=document.getElementById('shutdown-output');
        shutdownOutput.innerText=`Pod will shutdown after ${after} seconds`
    })
}

function writeMessage() {
    let path = document.getElementById('write-directory').value || '/tmp';
    fetch('/write', {
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
        const writeOutput=document.getElementById('write-output');
        writeOutput.innerText=`Written some text to '${path}' this path`
    }).catch(err => {
        const writeOutput=document.getElementById('write-output');
        writeOutput.innerText=`Unable to write text to '${path}' this path`
     }).finally(data=>{
    })
}

function readMessage() {
    let path = document.getElementById('read-directory').value || '/tmp';
    fetch(`/read?path=${path}`).then(res => {
        if (res.ok) {
            return res.text();
        } else {
            throw new Error('Network response was not ok');
        }
    }).then(data => {
        const readOutput=document.getElementById('read-output');
        readOutput.innerText=`Read '${data}' from ${path} path`
    }).catch(err => { const readOutput=document.getElementById('read-output');
        readOutput.innerText=`Unable to read data from ${path} path` })
}

function dos() {
    let duration = document.getElementById('dos-duration').value||10;
    let url = document.getElementById('dos-url').value||'localhost';
    fetch('/concurrent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url,duration: duration })
    }).then(res => {
        if (res.ok) {
            return res.text();
        } else {
            throw new Error('Network response was not ok');
        }
    }).then(data => {
        const dosOutput=document.getElementById('dos-output');
        dosOutput.innerText=`Started DoS for ${duration} seconds`
    }).catch(err => { console.error(err) })
}
function logFlood() {
    let duration = document.getElementById('log-duration').value||10;
    let level = document.getElementById('log-status').value;
    console.log(level);
    fetch('/logs', {
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
        const logFloodOutput=document.getElementById('log-output');
        logFloodOutput.innerText=`Started Log Flood for ${duration} seconds`
    }).catch(err => { console.error(err) })
}