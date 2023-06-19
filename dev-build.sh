#!/bin/bash

# Clean up previous build artifacts
echo "Cleaning up previous build artifacts ..."
rm -rf openmrs-config-kenyaemr
rm -rf frontend

# Build assets
echo "Building Kenya EMR 3.x assets ..."
CWD=$(pwd)
npx --legacy-peer-deps openmrs@4.5.1-pre.804 build \
  --build-config ./configuration/dev-build-config.json \
  --target ./frontend \
  --page-title "KenyaEMR" \
  --support-offline false

# Assemble assets
echo "Assembling assets ..."
npx --legacy-peer-deps openmrs@4.5.1-pre.804 assemble \
  --manifest \
  --mode config \
  --config ./configuration/dev-build-config.json \
  --target ./frontend

# Copy required files
echo "Copying required files ..."
cp "${CWD}/assets/kenyaemr-login-logo.png" "${CWD}/frontend"
cp "${CWD}/assets/kenyaemr-primary-logo.png" "${CWD}/frontend"
cp "${CWD}/assets/favicon.ico" "${CWD}/frontend"
cp "${CWD}/configuration/dev-config.json" "${CWD}/frontend"
mv "${CWD}/frontend/dev-config.json" "${CWD}/frontend/config.json"

# Exit with success status
exit 0
