import { v4 as uuidv4 } from 'uuid';
import express from 'express';

export const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.post('/create-user', async (req, res) => {

    const userId = uuidv4();

    res.json({
        userId
    });
});
