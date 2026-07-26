#!/bin/sh

echo "Starting workers:"
nodemon api.js &
nodemon workers/delivery.worker.js &
nodemon workers/ingestion.worker.js &
nodemon workers/processing.worker.js &



