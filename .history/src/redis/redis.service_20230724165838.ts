import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisClient } from './redis.providers';
import {
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from './redis.constants';

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

    this.pubSubClient.on('error', (err) => {
      console.log('Error on Redis Pub/Sub client');
      console.log(err);
      process.exit(1);
    });

    this.cacheClient.on('connect', () => {
      console.log('Redis cache client connected');
    });

    this.pubSubClient.on('connect', () => {
      console.log('Redis Pub/Sub client connected');
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

  async subscribe(channel: string) {
    return await this.pubSubClient.subscribe(channel);
  }

  async publish(channel: string, message: string) {
    return await this.pubSubClient.publish(channel, message);
  }

  async unsubscribe(channel: string) {
    return await this.pubSubClient.unsubscribe(channel);
  }

  // Other methods, if needed
}
