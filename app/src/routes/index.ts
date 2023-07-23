import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import axios from 'axios';
import { securer } from '../middlewares/security';
import { ENDPOINT_TYPE } from '../constants';
import { docRouter } from './docRoutes';

export const router = express.Router();

router.use(docRouter);

router.post('/create-user', securer(ENDPOINT_TYPE.PUBLIC), async (req, res) => {
    const userId = uuidv4();
    res.json({
        userId
    });
});

router.get('/json-placeholder', securer(ENDPOINT_TYPE.PRIVATE, 1), async (req, res) => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    res.json(response.data);
});

router.get('/cat-facts', securer(ENDPOINT_TYPE.PRIVATE, 2), async (req, res) => {
    const response = await axios.get('https://cat-fact.herokuapp.com/facts/random');
    res.json(response.data);
});

router.get('/dog-api', securer(ENDPOINT_TYPE.PRIVATE, 2), async (req, res) => {
    const response = await axios.get('https://dog.ceo/api/breeds/image/random');
    res.json(response.data);
});

router.get('/rick-and-morty', securer(ENDPOINT_TYPE.PRIVATE, 5), async (req, res) => {
    const response = await axios.get('https://rickandmortyapi.com/api/character/1');
    res.json(response.data);
});

router.get('/joke-api', securer(ENDPOINT_TYPE.PRIVATE, 1), async (req, res) => {
    const response = await axios.get('https://official-joke-api.appspot.com/jokes/programming/random');
    res.json(response.data);
});
