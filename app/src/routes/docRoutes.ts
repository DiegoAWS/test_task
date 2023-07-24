import express from 'express';

export const docRouter = express.Router();

docRouter.use( (req, res) => {
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
                security: 'No Auth',
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
                weight: '5'
            },
        ]
    }

    res.json(documentation);
});
