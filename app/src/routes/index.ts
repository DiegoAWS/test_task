import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import { limiter } from '../middlewares/trottle-api.js';
export const router = express.Router()

router.use(limiter())

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.post('/create-user', async (req, res) => {

    const userId = uuidv4();

    res.json({
        userId
    });
});
