const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const { Queue } = require("bullmq");
const connection = require("./redis");

// your queues
const ingestionQueue = new Queue("ingestion", { connection });
const processingQueue = new Queue("processing", { connection });
const deliveryQueue = new Queue("delivery", { connection });

// UI adapter
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(ingestionQueue),
    new BullMQAdapter(processingQueue),
    new BullMQAdapter(deliveryQueue),
  ],
  serverAdapter,
});

module.exports = { serverAdapter };
