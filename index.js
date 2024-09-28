const express = require('express');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const os = require('os');
const fs = require('fs');
const { faker } = require('@faker-js/faker');
const axios = require('axios');

const app = express();
const app_name = faker.internet.userName();
const avatar = faker.image.avatar();
const port = 3000;
let workers = [];
let status = 200;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies (from form submissions)
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index.html')
});

app.get('/health', (req, res) => {
    res.status(parseInt(status)).send({ name: app_name, status: status })
});

app.post('/health', (req, res) => {
    status = req.body.status || status;
    if(req.body.duration) {
        setTimeout(()=>{status='200'},parseInt(req.body.duration)*1000)
    }
    res.send({ name: app_name, status: status })
})

app.get('/name', (req, res) => {
    res.send({ name: app_name, avatar: avatar });
});

app.post('/freeze', (req, res) => {
    const data = req.body;
    const duration = Date.now() + (data.duration * 1000 || 10000);
    console.log('freezed')
    res.send('freezed!');
    while (Date.now() < duration) { }
});

app.post('/close', (req, res) => {
    res.send("closing...")
    setTimeout(()=>{
        stopServer(req.body.exitCode||0)
    }, req.body.after * 1000);
});

// Handle CPU stress request
app.post('/stress', (req, res) => {
    const data = req.body;
    let numCores = os.cpus().length;
    if (data.cores) {
        numCores = data.cores;
    }
    const duration = data.duration ? data.duration : 10;
    console.log(`Starting stress test with ${numCores} worker threads...`);
    res.send("stressing...")
    let completed = 0;


    for (let i = 0; i < numCores; i++) {
        const worker = new Worker('./worker.js', { workerData: { duration: duration } });
        workers.push(worker);

        worker.on('message', (message) => {
            if (message === 'done') {
                completed++;
                if (completed === numCores) {
                    console.log('CPU stress test completed.');
                }
            }
        });
    }
});


app.post('/write', (req, res) => {
    const prefix = `Written by ${app_name} at ${Date.now()} `
    let data = ''
    if (req.body.text) {
        data = prefix + ': ' + req.body.text;
    } else {
        data = prefix + `: Hi I'm ${app_name}!\n`;
    }
    let path = req.body.path;
    try {
        // Write data to a file named 'example.txt'
        if (req.body.rewrite) {
            fs.writeFileSync(`${path}/message.txt`, data, 'utf8');
        } else {
            fs.appendFileSync(`${path}/message.txt`, data, 'utf-8');
        }
        console.log('File has been written successfully.');
    } catch (err) {
        console.error('Error writing file:', err);
    }
    res.send('written...')
});

app.get('/read', (req, res) => {
    let path = req.query.path;
    try {
        // Synchronous file read
        const data = fs.readFileSync(`${path}/message.txt`, 'utf8');
        console.log('file read')
        res.send(data)
    } catch (err) {
        console.error('Error reading file:', err);
    }
});

app.get('/discover', async (req, res) => {
    let cont = {};
    const url = req.body.url;
    const duration = Date.now() + req.body.duration * 1000;
    while (Date.now() < duration) {
        const response_health = await axios.get(url + '/health');
        const n = response_health.data.name;
        const h = response_health.data.status;
        cont[n] = h;
    }
    res.send(cont);
});

app.get('/hunter', (req, res) => {

});

app.post('/concurrent', async (req, res) => {
    const duration = Date.now() + (req.body.duration * 1000 || 10000);
    const url = req.body.url || `https://localhost:${port}/`;
    console.log('hitting')
    res.send('hitting...');
    while (Date.now() < duration) {
        axios.get(url).catch(error => { });
        console.log(Date.now() + " hitting")
    }
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.post('/logs', (req, res) => {
    const duration = Date.now() + req.body.duration * 1000 || 10000;
    console.log(req.body.level)
    res.send('logging...')
    while (Date.now() < duration) {
        const randomInt = req.body.level || getRandomInt(1, 4);
        switch (parseInt(randomInt)) {
            case 1:
                console.log(Date.now() + ' ' + faker.lorem.sentence());
                break;
            case 2:
                console.debug(Date.now() + " " + faker.lorem.sentence());
                break;
            case 3:
                console.warn(Date.now() + " " + faker.lorem.sentence());
                break;
            case 4:
                console.error(Date.now() + " " + faker.lorem.sentence());
                break;
        }
    }
});

const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});

function stopServer(exitCode) {
    for (worker of workers) {
        worker.terminate()
    }
    server.close(() => {
        console.log(`Server stopped with ${exitCode} exit code`);
        process.exit(parseInt(exitCode));
    });
};