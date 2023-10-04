import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { Server } from 'socket.io';
@Injectable()
export class RedisService {
  private readonly cacheClient: Redis;
  private readonly pubClient: Redis;
  private readonly subClient: Redis;
  // private schoolGateway: SchoolGateway;
  private readonly subscribers: { [channel: string]: Server[] } = {};
  constructor() {}

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

  // async subscribe(channel: string, server: Server) {
  //   if (!this.subscribers[channel]) {
  //     this.subscribers[channel] = [];
  //     await this.subClient.subscribe(channel);
  //   }
  //   return this.subscribers[channel].push(server);
  // }

  // async publish(channel: string, message: string) {
  //   return await this.pubClient.publish(channel, message);
  // }

  // async unsubscribe(channel: string, server: Server) {
  //   if (this.subscribers[channel]) {
  //     const index = this.subscribers[channel].indexOf(server);
  //     if (index !== -1) {
  //       this.subscribers[channel].splice(index, 1);
  //       if (this.subscribers[channel].length === 0) {
  //         delete this.subscribers[channel];
  //         return await this.subClient.unsubscribe(channel);
  //       }
  //     }
  //   }
  // }
}
