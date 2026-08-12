// workers/processing.worker.js
const { Worker } = require("bullmq");
const connection = require("../redis");
const { deliveryQueue } = require("../queues");
const { PDFDocument } = require("pdf-lib");
//const fetch = require("node-fetch");

async function mergePDFs(urls) {
  const mergedPdf = await PDFDocument.create();

  for (const url of urls) {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();

    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save();
  return mergedBytes;
}

new Worker(
  "processing",
  async (job) => {
    const { email, pdfUrls } = job.data;
    let mergedPdf;
    if ( pdfUrls && pdfUrls.length > 1 ) {
      mergedPdf = await mergePDFs(pdfUrls);
    }

    await deliveryQueue.add("send-email", {
      email,
      fileBuffer: mergedPdf,
    });
  },
  { connection }
);
