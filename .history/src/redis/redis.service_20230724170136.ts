import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisClient } from './redis.providers';
import {
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from './redis.constants';
import { Observable, Observer } from 'rxjs';
export interface RedisSubscribeMessage {
  readonly message: string;
  readonly channel: string;
}

@Injectable()
export class RedisService {
  private readonly cacheClient: Redis;

  constructor(
    @Inject(REDIS_SUBSCRIBER_CLIENT)
    private readonly redisSubscriberClient: RedisClient,
    @Inject(REDIS_PUBLISHER_CLIENT)
    private readonly redisPublisherClient: RedisClient,
  ) {
    this.cacheClient = new Redis(process.env.REDIS_URL);

    this.cacheClient.on('error', (err) => {
      console.log('Error on Redis cache client');
      console.log(err);
      process.exit(1);
    });

    this.cacheClient.on('connect', () => {
      console.log('Redis cache client connected');
    });
  }

  // Redis caching methods

  async get(key: string) {
    return await this.cacheClient.get(key);
  }

  async set(key: string, value: string, mode?: string, duration?: number) {
    if (mode === 'EX' && duration) {
      return await this.cacheClient.set(key, value, mode, duration);
    }
    return await this.cacheClient.set(key, value);
  }

  // Redis Pub/Sub methods

  public async publish(channel: string, value: unknown): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      return this.redisPublisherClient.publish(
        channel,
        JSON.stringify(value),
        (error, reply) => {
          if (error) {
            return reject(error);
          }

          return resolve(reply);
        },
      );
    });
  }

  // Other methods, if needed
}
