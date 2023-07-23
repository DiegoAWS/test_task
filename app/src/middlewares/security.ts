import { NextFunction, Request, Response } from "express";
import { ENDPOINT_TYPE, TOKEN_LIMIT_PRIVATE_ENDPOINTS, TOKEN_LIMIT_PUBLIC_ENDPOINTS } from "../constants";
import { limiter } from "./trottle-api";


export function securer(endpointType: ENDPOINT_TYPE, weight: number) {

    return async function (req: Request, res: Response, next: NextFunction) {

        if (endpointType === ENDPOINT_TYPE.PUBLIC) {
            // get token based on IP
            const token = req.header('x-forwarded-for') || req.socket.remoteAddress;
            if (!token) {
                res.status(401).json({
                    message: 'IP not found'
                });
                return;
            }

            return limiter(token, TOKEN_LIMIT_PUBLIC_ENDPOINTS, weight)(req, res, next);
        }
        if (endpointType === ENDPOINT_TYPE.PRIVATE) {
            // get token based on auth
            const token = req.header('x-access-token');
            if (!token) {
                res.status(401).json({
                    message: 'Token not found'
                });
                return;
            }
            return limiter(token, TOKEN_LIMIT_PRIVATE_ENDPOINTS, weight)(req, res, next);
        }

    }
}
