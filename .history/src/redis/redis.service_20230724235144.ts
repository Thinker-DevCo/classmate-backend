import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly cacheClient: Redis;
  private readonly pubClient: Redis;
  private readonly subClient: Redis;
  constructor() {
    this.cacheClient = new Redis(process.env.REDIS_URL);
    this.pubClient = new Redis(process.env.REDIS_URL);
    this.subClient = new Redis(process.env.REDIS_URL);

    this.cacheClient.on('error', (err) => {
      console.log('Error on Redis cache client');
      console.log(err);
      process.exit(1);
    });

    this.pubClient.on('error', (err) => {
      console.log('Error on Redis Pub/Sub client');
      console.log(err);
      process.exit(1);
    });
    this.subClient.on('error', (err) => {
      console.log('Error on Redis Pub/Sub client');
      console.log(err);
      process.exit(1);
    });

    this.cacheClient.on('connect', () => {
      console.log('Redis cache client connected');
    });

    this.pubClient.on('connect', () => {
      console.log('Redis Pub/Sub client connected');
    });
    this.subClient.on('connect', () => {
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
    return await this.subClient.subscribe(channel);
  }

  async publish(channel: string, message: string) {
    return await this.pubClient.publish(channel, message);
  }

  async unsubscribe(channel: string) {
    return await this.subClient.unsubscribe(channel);
  }

  on(channel: string, callback: (channel: string, message: string) => void) {
    this.subClient.on('message', (receivedChannel: string, message: string) => {
      if (channel === receivedChannel) {
        callback(receivedChannel, message);
      }
    });
  }
  async handleRedisMessage(channel: string, message: string) {
    console.log(`Received Redis message in channel '${channel}': ${message}`);
    // Here, you can process the Redis message as needed
  }
}
