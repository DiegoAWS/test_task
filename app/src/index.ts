import { createClient } from 'redis';
import cors from 'cors';
import express from 'express';
import { router } from './routes/index.js';
import dotenv from 'dotenv';
export const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

export const client = createClient({
    // url: 'redis://redis:6379'
    socket:{
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
    
});

app.use(cors());
app.use(express.json());
app.use(router);


app.listen(PORT, async () => {
    await client.connect();
    console.log(`Server listening on port ${PORT}`);
});
