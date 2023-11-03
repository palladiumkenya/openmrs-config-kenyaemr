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
yes | npx --legacy-peer-deps openmrs@5.2.1-pre.1129 build \
  --build-config ./frontend-config/prod-build-config.json \
  --target ./frontend \
  --page-title "KenyaEMR" \
  --support-offline false

# Assemble assets
echo
echo "Assembling assets ..."
echo
yes | npx --legacy-peer-deps openmrs@5.2.1-pre.1129 assemble \
  --manifest \
  --mode config \
  --config ./frontend-config/prod-build-config.json \
  --target ./frontend

# Copy required files
echo "Copying required files ..."
cp "${CWD}/assets/kenyaemr-login-logo.png" "${CWD}/frontend"
cp "${CWD}/assets/kenyaemr-primary-logo.svg" "${CWD}/frontend"
cp "${CWD}/assets/favicon.ico" "${CWD}/frontend"
cp "${CWD}/frontend-config/prod-config.json" "${CWD}/frontend"
mv "${CWD}/frontend/prod-config.json" "${CWD}/frontend/config.json"

# Find the folder that matches the pattern and store its name
folder_name=$(find frontend -name "openmrs-esm-form-entry-app-*" -type d | head -n 1 | sed 's|frontend/||')

# Check if the folder_name is not empty
if [ -n "$folder_name" ]; then
  # Check if 'dist' directory exists at the same level as 'frontend'
  if [ -d "dist" ]; then
    # Rename the 'dist' directory to the copied folder name
    mv dist "$folder_name"
    echo "The 'dist' directory has been renamed to '$folder_name'"

    # Now copy the renamed folder back into the 'frontend' directory
    cp -r "$folder_name" "frontend/"
    echo "The renamed folder has been copied back into the 'frontend' directory."
    mv "$folder_name" dist
  else
    echo "The 'dist' directory does not exist in the expected location."
  fi
else
  echo "No directory matching the pattern 'openmrs-esm-form-entry-app-*' was found within the 'frontend' directory."
fi

# Exit with success status
exit 0
