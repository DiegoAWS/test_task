import { NextFunction, Request, Response } from "express";
import { ENDPOINT_TYPE } from "../types";
import { limiter } from "./trottle-api";
import { checkUserExist } from "../services/userServices";

const TOKEN_LIMIT_PRIVATE_ENDPOINTS = Number(process.env.TOKEN_LIMIT_PRIVATE_ENDPOINTS || 200)
const IP_LIMIT_PUBLIC_ENDPOINTS = Number(process.env.IP_LIMIT_PUBLIC_ENDPOINTS || 100)

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

            return limiter(token, IP_LIMIT_PUBLIC_ENDPOINTS, weight)(req, res, next);
        }
        if (endpointType === ENDPOINT_TYPE.PRIVATE) {
            // get token based on auth
            const token = req.header('x-access-token');

            if (!token || ! await checkUserExist(token)) {
                return res.status(401).json({
                    message: 'Invalid token'
                });
            }

            return limiter(token, TOKEN_LIMIT_PRIVATE_ENDPOINTS, weight)(req, res, next);
        }

        if(endpointType === ENDPOINT_TYPE.NO_AUTH){
            // JUST FOR TESTING PURPOSES
            return next();
        }

        return res.status(500).json({
            message: 'Internal server error'
        });


    }
}
