// api.js
//
const express = require("express");
const {ingestionQueue } = require("./queues");
const { serverAdapter } = require("./bullBoard");

const app = express();

app.use(express.json());

// Bull Board UI route
app.use("/admin/queues", serverAdapter.getRouter());

// Endpoint
app.post("/email-webhook", async (req, res) => {
	const { email, attachments } = req.body;

	await ingestionQueue.add("email-received", {
		email,
		pdfUrls: attachments,
		});

	// TODO some job id??
	res.send({ ok: true});
});

app.listen(3000, () => {
	console.info("API running on http://localhost:3000");
	console.info("Bull board at http://localhost:3000/admin/queues");
});

