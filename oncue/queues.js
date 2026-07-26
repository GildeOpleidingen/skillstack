// queues.js
//
const { Queue } = require("bullmq");
const connection = require("./redis");

const ingestionQueue = new Queue("ingestion", { connection });
const processingQueue = new Queue("processing", { connection });
const deliveryQueue = new Queue("delivery", { connection });

module.exports = {
	ingestionQueue,
	processingQueue,
	deliveryQueue,
};
