import { NextFunction, Request, Response } from "express";
import { ENDPOINT_TYPE, TOKEN_LIMIT_PRIVATE_ENDPOINTS, TOKEN_LIMIT_PUBLIC_ENDPOINTS } from "../constants";
import { limiter } from "./trottle-api";

/**
 * 
 * Middleware function to secure endpoints
 * 
 * If the endpoint is public, we use the IP of the user as token.
 * If the endpoint is private, we use the token provided by the user as token.
 * 
 * 
 * @param endpointType Type of endpoint (PUBLIC or PRIVATE)
 * @param weight weight of the request
 * @returns Middleware function
 */
export function securer(endpointType: ENDPOINT_TYPE, weight: number = 1) {

    return async function (req: Request, res: Response, next: NextFunction) {

        if (endpointType === ENDPOINT_TYPE.PUBLIC) {
            // get token based on IP
            const token = req.header('x-forwarded-for') || req.socket.remoteAddress;
            if (!token) {
                return res.status(401).json({
                    message: 'IP not found'
                });
            }

            return limiter(token, TOKEN_LIMIT_PUBLIC_ENDPOINTS, weight)(req, res, next);
        }
        if (endpointType === ENDPOINT_TYPE.PRIVATE) {
            // get token based on auth
            const token = req.header('x-access-token');
            if (!token) {
                return res.status(401).json({
                    message: 'Token not found'
                });
            }
            return limiter(token, TOKEN_LIMIT_PRIVATE_ENDPOINTS, weight)(req, res, next);
        }

        return res.status(500).json({
            message: 'Internal server error'
        });


    }
}
