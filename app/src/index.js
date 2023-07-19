import { createClient } from 'redis';
import cors from 'cors';
import express from 'express';

const app = express();
const PORT = 5000;

const client = createClient({
    url: 'redis://redis:6379'
});

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/test-redis', async (req, res) => {

    const elements = 2_000;

    // mesure time to insert ${elements} strings
    const start0 = Date.now();
    for (let i = 0; i < elements; i++) {
        await client.set(`key:${i}`, 'Test');
    }
    const end0 = Date.now();
    console.log(`Insert ${elements} strings in ${end0 - start0}ms`);

    // mesure time to get ${elements} strings
    const start2 = Date.now();
    for (let i = 0; i < elements; i++) {
        await client.get(`key:${i}`);
    }
    const end2 = Date.now();
    console.log(`Get ${elements} strings in ${end2 - start2}ms`);

    const average = (end0 - start0 + end2 - start2) / (2 * elements)

    console.log(`Average ${average}ms`)

    res.json({
        insert: end0 - start0,
        get: end2 - start2,
        average
    });
});

app.listen(PORT, async () => {
    await client.connect();

    console.log(`Server listening on port ${PORT}`);

});




