import { NextFunction, Request, Response } from "express";
import { decrementCounterBy, getCounter, getTimeToLive, setCounter } from "../services/counterService.js";
import { TIME_WINDOWS } from "../constants.js";



export function limiter(token: string, tokenLimit: number, weight: number) {
    return async function (req: Request, res: Response, next: NextFunction) {

        const tokenAvailables = await getCounter(token);

        if (tokenAvailables===null) {
            const newTokenAvailable = tokenLimit - 1;
            await setCounter(token, newTokenAvailable, TIME_WINDOWS);
            res.setHeader('X-RateLimit-Remaining', newTokenAvailable);
            return next();
        }

        if (tokenAvailables > 0) {
            const counterNewValue = await decrementCounterBy(token, weight);
            res.setHeader('X-RateLimit-Remaining', counterNewValue);


            return next();
        }

        const timeToLive = await getTimeToLive(token);
        res.setHeader('X-RateLimit-Reset', timeToLive);
        res.status(429).json({
            message: 'Too many requests'
        });
    }
}
