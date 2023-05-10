import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService extends Redis {
  private readonly redisClient: Redis;
  constructor() {
    super();
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379,
    });
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
