import { NextFunction, Request, Response } from "express";
import { decrementCounterBy, getCounter, getExpireTime, setCounter } from "../services/counterService.js";

const timeWindows = Number(process.env.TIME_WINDOWS_SECONDS || 60);


/**
 * 
 * Working of the Bucket Algorithm
 * 
 * Here we have a bucket that can hold a maximum of tokenLimit tokens.
 * This bucket has a time to live of TIME_WINDOWS seconds. (In our case 1 hour)
 * 
 * When a request comes in, we check if the bucket exist in redis.
 * If it does not exist, we create a new bucket with tokenLimit - 1 tokens and we allow the request to pass. 
 * (We set the time to live of the bucket to TIME_WINDOWS seconds)
 * 
 * If the bucket exist, we check if the bucket has tokens available.
 * If it does, we decrement the number of tokens available by the weight of the request and we allow the request to pass.
 * 
 * If the bucket exist and it does not have tokens available, we return a 429 status code and we set the header X-RateLimit-Reset to the time to live of the bucket.
 * 
 * 
 * @param token token to be used as key in redis
 * @param tokenLimit 
 * @param weight 
 * @returns express middleware function with the Bucket Algorithm implemented
 */
export function limiter(token: string, tokenLimit: number, weight: number) {
    return async function (req: Request, res: Response, next: NextFunction) {
        res.setHeader('X-RateLimit-Limit', tokenLimit);
        res.setHeader('X-RateLimit-Weight', weight);
        
        const tokenAvailables = await getCounter(token);

        if (tokenAvailables===null) {
            const newTokenAvailable = tokenLimit - 1;
            await setCounter(token, newTokenAvailable, timeWindows);
            
            res.setHeader('X-RateLimit-Remaining', newTokenAvailable);
            return next();
        }

        

        if (tokenAvailables > 0) {
            const counterNewValue = await decrementCounterBy(token, weight);

            res.setHeader('X-RateLimit-Remaining', counterNewValue);
            return next();
        }

        const timeToReset = await getExpireTime(token);
        res.setHeader('X-RateLimit-Reset',timeToReset);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.status(429).json({
            message: 'Too many requests'
        });
    }
}
