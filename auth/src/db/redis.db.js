const { Redis } = require('ioredis');
const config = require('../config/environments');
const redis = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
});

redis.on('connect', () => {
    console.log('Redis connected');
});

redis.on('error', (err) => {
    console.log('Redis error', err.message);
});

module.exports = redis;
