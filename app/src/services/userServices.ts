import { v4 as uuidv4 } from 'uuid';
import { redis } from '../db/redis';
const USER_PREFIX = 'user:';

export async function createUser(): Promise<string> {
    const userId = uuidv4();
    await redis.hSet(USER_PREFIX+userId,{
        'userId':userId
    })
    return userId;
}

export async function checkUserExist(userId?: string): Promise<boolean> {
    return await redis.exists(USER_PREFIX+userId) === 1;
}
