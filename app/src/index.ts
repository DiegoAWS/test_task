import 'dotenv/config'
import cors from 'cors';
import express from 'express';
import { router } from './routes/index.js';
import { redis } from './db/redis.js';
export const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, async () => {
    await redis.connect();
    console.log(`Server listening on  http://localhost:${PORT}`);
});

app.on('close', async () => {
    await redis.quit();
    console.log('Server closed');
});
