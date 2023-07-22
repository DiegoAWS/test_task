import { NextFunction, Request, Response } from "express";
import { client } from "../index.js";
import { TokenBucket } from "../types.js";

const tokenLimitByHours = Number(process.env.TOKEN_LIMIT_BY_HOURS) || 3;
const ONE_HOUR = 60 * 60 * 1000;

export function limiter() {
    return async function (req: Request, res: Response, next: NextFunction) {
        const token = req.headers['x-api-key'];

        if (!token || typeof token !== 'string') {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        res.setHeader('X-RateLimit-Limit', tokenLimitByHours.toString());

        const tokenBucket = await client.hGetAll(token);

        if (!tokenBucket?.timestamp || (Date.now() - Number(tokenBucket.timestamp)) > ONE_HOUR) {
            const created = await client.hSet(token, {
                timestamp: Date.now().toString(),
                count: tokenLimitByHours.toString()
            });
            res.setHeader('X-RateLimit-Remaining', tokenLimitByHours.toString());
            res.setHeader('X-RateLimit-Reset', (Date.now() + ONE_HOUR).toString());
            return next();
        }

        if (Number(tokenBucket.count) > 0) {
            const updated = await client.hSet(token, {
                timestamp: tokenBucket.timestamp,
                count: (Number(tokenBucket.count) - 1).toString()
            })
            res.setHeader('X-RateLimit-Remaining', (Number(tokenBucket.count) - 1).toString());
            res.setHeader('X-RateLimit-Reset', (Number(tokenBucket.timestamp) + ONE_HOUR).toString());

            return next();
        }

        res.status(429).json({
            message: 'Too many requests'
        });
    }
}
