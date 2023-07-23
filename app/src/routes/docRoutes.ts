import express from 'express';
import { securer } from '../middlewares/security';
import { ENDPOINT_TYPE } from '../constants';

export const docRouter = express.Router();

docRouter.get('/', securer(ENDPOINT_TYPE.PUBLIC), (req, res) => {
    const documentation = {
        endpoints: [
            {
                path: '/',
                method: 'GET',
                description: 'Returns the documentation',
                security: 'Public',
                weight: '1'
            },
            {
                path: '/create-user',
                method: 'POST',
                description: 'Creates a new user and returns a unique ID',
                security: 'Public',
                weight: '1'
            },
            {
                path: '/json-placeholder',
                method: 'GET',
                description: 'Fetches data from the JSONPlaceholder API',
                security: 'Private',
                weight: '1'
            },
            {
                path: '/cat-facts',
                method: 'GET',
                description: 'Fetches a random cat fact from the Cat Facts API',
                security: 'Private',
                weight: '2'
            },
            {
                path: '/dog-api',
                method: 'GET',
                description: 'Fetches a random dog image from the Dog API',
                security: 'Private',
                weight: '1'
            },
            {
                path: '/rick-and-morty',
                method: 'GET',
                description: 'Fetches a character from the Rick and Morty API',
                security: 'Private',
                weight: '5'
            },
            {
                path: '/joke-api',
                method: 'GET',
                description: 'Fetches a random programming joke from the Joke API',
                security: 'Private',
                weight: '1'
            },
        ]
    }

    res.json(documentation);
});
