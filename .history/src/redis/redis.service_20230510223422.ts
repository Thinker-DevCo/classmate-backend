import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService extends Redis {
  private redisClient: Redis;
  constructor() {
    super();
    this.redisClient = new Redis(process.env.REDIS_URL);

    super.on('error', (err) => {
      console.log('Error on redis');
      console.log(err);
      process.exit(1);
    });

    super.on('connect', () => {
      console.log('redis connected');
    });
  }
}