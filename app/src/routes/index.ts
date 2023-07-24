
import express from 'express';
import axios from 'axios';
import { securer } from '../middlewares/security';
import { ENDPOINT_TYPE } from '../types';
import { docRouter } from './docRoutes';
import { createUser } from '../services/userServices';

export const router = express.Router();

router.get('/', securer(ENDPOINT_TYPE.PUBLIC), docRouter);

router.post('/create-user', securer(ENDPOINT_TYPE.NO_AUTH), async (req, res) => {

    const userId = await createUser();
    res.json({
        "x-access-token": userId
    });
});


// Mock data for the '/json-placeholder' endpoint
router.get('/json-placeholder', securer(ENDPOINT_TYPE.PRIVATE, 1), async (req, res) => {
    const response = [
        {
            id: 1,
            joke: 'Parallel lines have so much in common. It\'s a shame they\'ll never meet.',
        },
    ];
    res.json(response);
});

// Mock data for the '/cat-facts' endpoint
router.get('/cat-facts', securer(ENDPOINT_TYPE.PRIVATE, 2), async (req, res) => {
    const mockData = {
        fact: 'Mock cat fact',
    };
    res.json(mockData);
});

// Mock data for the '/dog-api' endpoint
router.get('/dog-api', securer(ENDPOINT_TYPE.PRIVATE, 2), async (req, res) => {
    const mockData = {
        message: 'https://dog.ceo/api/breeds/image/random',
    };
    res.json(mockData);
});

// Mock data for the '/rick-and-morty' endpoint
router.get('/rick-and-morty', securer(ENDPOINT_TYPE.PRIVATE, 5), async (req, res) => {
    const mockData = {
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
    };
    res.json(mockData);
});

// Mock data for the '/joke-api' endpoint
router.get('/joke-api', securer(ENDPOINT_TYPE.PRIVATE, 5), async (req, res) => {
    const mockData = [
        {
            id: 1,
            type: 'programming',
            setup: 'Why do programmers always mix up Christmas and Halloween?',
            punchline: 'Because Oct 31 == Dec 25!',
        },
    ];
    res.json(mockData);
});
