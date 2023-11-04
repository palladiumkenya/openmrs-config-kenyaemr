#!/bin/bash

# Clean up previous build artifacts
echo "Cleaning up previous build artifacts ..."
rm -rf openmrs-config-kenyaemr
rm -rf frontend

# Build assets
echo
echo "Building Kenya EMR 3.x assets ..."
echo
CWD=$(pwd)
yes | npx --legacy-peer-deps openmrs@5.2.1-pre.1134 build \
  --build-config ./frontend-config/prod-build-config.json \
  --target ./frontend \
  --page-title "KenyaEMR" \
  --support-offline false

# Assemble assets
echo
echo "Assembling assets ..."
echo
yes | npx --legacy-peer-deps openmrs@5.2.1-pre.1134 assemble \
  --manifest \
  --mode config \
  --config ./frontend-config/prod-build-config.json \
  --target ./frontend

# Copy required files
echo "Copying required files ..."
cp "${CWD}/assets/kenyaemr-login-logo.png" "${CWD}/frontend"
cp "${CWD}/assets/kenyaemr-primary-logo.png" "${CWD}/frontend"
cp "${CWD}/assets/favicon.ico" "${CWD}/frontend"
cp "${CWD}/frontend-config/prod-config.json" "${CWD}/frontend"
mv "${CWD}/frontend/prod-config.json" "${CWD}/frontend/config.json"

# Exit with success status
exit 0
