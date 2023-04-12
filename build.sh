#!/bin/bash

# Clean up previous build artifacts
echo "Cleaning up previous build artifacts ..."
rm -rf openmrs-config-kenyaemr
rm -rf spa

# Build assets
echo "Building Kenya EMR 3.x assets ..."
CWD=$(pwd)
npx --legacy-peer-deps openmrs@next build \
  --build-config ./configuration/spa-build-config.json \
  --target ./spa \
  --page-title "KenyaEMR" \
  --support-offline false

# Assemble assets
echo "Assembling assets ..."
npx --legacy-peer-deps openmrs@next assemble \
  --manifest \
  --mode config \
  --config ./configuration/spa-build-config.json \
  --target ./frontend

# Copy required files
echo "Copying required files ..."
git clone https://github.com/palladiumkenya/openmrs-config-kenyaemr.git
cp "${CWD}/openmrs-config-kenyaemr/assets/kenyaemr-login-logo.png" "${CWD}/spa"
cp "${CWD}/openmrs-config-kenyaemr/assets/kenyaemr-primary-logo.png" "${CWD}/spa"
cp "${CWD}/openmrs-config-kenyaemr/assets/favicon.ico" "${CWD}/spa"
cp "${CWD}/configuration/config.json" "${CWD}/spa"

# Exit with success status
exit 0
