// redis.js

const { Redis } = require("ioredis");


const connection = new Redis({
	host: 'localhost',
	port: 6379,
	maxRetriesPerRequest: null, // Required for BullMQ
});

module.exports = connection;
