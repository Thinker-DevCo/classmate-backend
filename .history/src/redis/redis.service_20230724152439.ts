import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis(process.env.REDIS_URL);

    this.redisClient.on('error', (err) => {
      console.log('Error on redis');
      console.log(err);
      process.exit(1);
    });

    this.redisClient.on('connect', () => {
      console.log('redis connected');
    });
  }

  // Redis caching methods

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string, mode?: string, duration?: number) {
    if (mode === 'EX' && duration) {
      return await this.redisClient.set(key, value, mode, duration);
    }
    return await this.redisClient.set(key, value);
  }

  // Redis Pub/Sub methods

  async subscribe(channel: string) {
    return await this.redisClient.subscribe(channel);
  }

  async publish(channel: string, message: string) {
    return await this.redisClient.publish(channel, message);
  }

  async unsubscribe(channel: string) {
    return await this.redisClient.unsubscribe(channel);
  }

  // Other methods, if needed
}
