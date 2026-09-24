#!/bin/sh
#cd ~/rateit || exit 1

TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
DATE=$(date +%Y%m%d)

echo "Version: ${TAG} <br /> build: ${DATE}.${HASH}" > public/version.txt
echo "Written version: $(cat public/version.txt)"