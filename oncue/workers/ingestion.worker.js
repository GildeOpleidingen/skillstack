// workes/ingestion.worker.js
//

const { Worker } = require("bullmq");
const connection = require("../redis");
const { processingQueue } = require("../queues");


new Worker(
	"ingestion",
	async (job) => {
		const { email, pdfUrls } = job.data;
		
		await processingQueue.add("merge-pdfs", {
			email,
			pdfUrls,
			});
	},
	{ connection }
);
