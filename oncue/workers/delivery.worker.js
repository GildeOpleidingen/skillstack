// workers/delivery.worker.js
const { Worker } = require("bullmq");
const connection = require("../redis");
const nodemailer = require("nodemailer");
require("dotenv").config();

/*
 const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
*/

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

new Worker(
  "delivery",
  async (job) => {
    console.log('workers/delivery.worker.js - Worker - job: ', job);
    const { email, fileBuffer } = job.data;

    const emailResult = await transporter.sendMail({
      to: email,
      from: "rayit@yourdomain.com",
      subject: "Your merged PDF is ready",
      text: "Here is your file.",
      attachments: [
        {
          filename: "merged.pdf",
          content: fileBuffer,
        },
      ],
    });
    console.log('workers/delivery.worker.js - Worker - emailResult: ', emailResult);
  },
  { connection }
);
