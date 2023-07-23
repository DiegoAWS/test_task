import { COUNTER_KEY } from "../constants";
import { redis } from "../db/redis";

/**
 * Get numeric counter from redis
 * @param key Redis key
 * @returns Promise<number>
 * @example
 * 
 * await setCounter('my-key', 1);
 * await getCounter('my-key');
 * // 1
 * 
 */
export async function getCounter(key: string): Promise<number> {
    const counter = await redis.get(COUNTER_KEY + key);
    return Number(counter);
}

/**
 *  Set numeric counter in redis
 * @param key Redis key
 * @param value numeric value
 * @param timeToLive time to live in SECONDS
 * @returns Promise<void>
 * @example
 * 
 * await setCounter('my-key', 1, 60);
 * await getCounter('my-key');
 * // 1
 * // after 60 seconds....
 * await getCounter('my-key');
 * // null
 * 
 */
export async function setCounter(key: string, value: number, timeToLive?: number): Promise<void> {
    if (!key) throw new Error('Key is required')
    if (typeof value !== 'number') throw new Error('Value must be a number')

    if (!timeToLive) {
        await redis.set(COUNTER_KEY + key, value);
        return;
    }

    await redis.set(COUNTER_KEY + key, value, 'EX', timeToLive);
}

/**
 * Decrements a numeric counter in redis
 * @param key Redis key
 * @returns Promise<number>
 * @example
 * 
 * await setCounter('my-key', 10);
 * 
 * await decrementCounter('my-key');
 * // 9
 * 
 * await decrementCounter('my-key', 5);
 * // 4
 * 
 */
export async function decrementCounterBy(key: string, amount: number = 1): Promise<number> {
    return await redis.decrby(COUNTER_KEY + key, amount);
}

export async function getTimeToLive(key: string): Promise<number> {
    return await redis.ttl(COUNTER_KEY + key);
}
