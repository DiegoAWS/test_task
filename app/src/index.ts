import cors from 'cors';
import express from 'express';
import { router } from './routes/index.js';
import dotenv from 'dotenv';
import { redis } from './db/redis.js';
export const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(router);


app.listen(PORT, async () => {
    await redis.connect();
    console.log(`Server listening on port ${PORT}`);
});

app.on('close', async () => {
    await redis.quit();
    console.log('Server closed');
});
