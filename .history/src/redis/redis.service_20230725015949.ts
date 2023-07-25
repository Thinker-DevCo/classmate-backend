import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { SchoolGateway } from 'src/school/school.gateway';
import { Server } from 'socket.io';
@Injectable()
export class RedisService {
  private readonly cacheClient: Redis;
  private readonly pubClient: Redis;
  private readonly subClient: Redis;
  private schoolGateway: SchoolGateway;
  private readonly subscribers: { [channel: string]: Server[] } = {};
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

    this.subClient.on('message', (channel, message) => {
      this.handleRedisMessage(channel, message);
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

  async subscribe(channel: string, server: Server) {
    if (!this.subscribers[channel]) {
      this.subscribers[channel] = [];
      await this.subClient.subscribe(channel);
    }
    return this.subscribers[channel].push(server);
  }

  async publish(channel: string, message: string) {
    return await this.pubClient.publish(channel, message);
  }

  async unsubscribe(channel: string, server: Server) {
    if (this.subscribers[channel]) {
      const index = this.subscribers[channel].indexOf(server);
      if (index !== -1) {
        this.subscribers[channel].splice(index, 1);
        if (this.subscribers[channel].length === 0) {
          delete this.subscribers[channel];
          return await this.subClient.unsubscribe(channel);
        }
      }
    }
  }

  on(channel: string, callback: (channel: string, message: string) => void) {
    this.subClient.on('message', (receivedChannel: string, message: string) => {
      if (channel === receivedChannel) {
        callback(receivedChannel, message);
      }
    });
  }
  private handleRedisMessage(channel: string, message: string) {
    console.log(message);
    const data = JSON.parse(message);
    this.schoolGateway.handleRedisMessage(channel, data);
  }
}
