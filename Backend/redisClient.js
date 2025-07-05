import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redis.on('error', (err) => console.error('❌ Redis Client Error', err));

await redis.connect();
console.log('🔗 Connected to Redis');

export default redis;
