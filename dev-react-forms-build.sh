#!/bin/bash
set -e # exit when any command fails

CWD=$(pwd)

# Clean up previous build artifacts
echo "Cleaning up previous build artifacts ..."
if [ -d "$CWD/openmrs-config-kenyaemr" ]; then
    rm -rf "$CWD/openmrs-config-kenyaemr"
fi
if [ -d "$CWD/frontend" ]; then
    rm -rf "$CWD/frontend"
fi

# Replace @openmrs/esm-form-entry-app with @openmrs/esm-form-engine-app
echo "Replacing @openmrs/esm-form-entry-app with @openmrs/esm-form-engine-app ..."
sed -i 's/"@openmrs\/esm-form-entry-app": "4.6.1-pre.1871"/"@openmrs\/esm-form-engine-app":"4.6.1-pre.1878"/g' "$CWD/configuration/dev-build-config.json"

# Build assets
echo "Building Kenya EMR 3.x assets ..."
npx --legacy-peer-deps openmrs@5.0.3-pre.863 build \
  --build-config "$CWD/configuration/dev-build-config.json" \
  --target "$CWD/frontend" \
  --page-title "KenyaEMR" \
  --support-offline false 

# Assemble assets
echo "Assembling assets ..."
npx --legacy-peer-deps openmrs@5.0.3-pre.863 assemble \
  --manifest \
  --mode config \
  --config "$CWD/configuration/dev-build-config.json" \
  --target "$CWD/frontend"

# Copy required files
echo "Copying required files ..."
cp "$CWD/assets/kenyaemr-login-logo.png" "$CWD/frontend"
cp "$CWD/assets/kenyaemr-primary-logo.svg" "$CWD/frontend"
cp "$CWD/assets/favicon.ico" "$CWD/frontend"
cp "$CWD/configuration/dev-config.json" "$CWD/frontend"
mv "$CWD/frontend/dev-config.json" "$CWD/frontend/config.json"

# Reverse the previous replacement of form entry app
echo "Reverting the replacement of form entry app ..."
sed -i 's/"@openmrs\/esm-form-engine-app":"4.6.1-pre.1878"/"@openmrs\/esm-form-entry-app": "4.6.1-pre.1871"/g' "$CWD/configuration/dev-build-config.json"

echo "Script completed successfully."
exit 0
