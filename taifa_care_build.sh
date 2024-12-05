#!/usr/bin/env bash

# Clean up previous build artifacts
echo "Cleaning up previous build artifacts ..."
rm -rf openmrs-config-kenyaemr
rm -rf frontend

# Prompt user for KDOD asset generation
read -p "Is this for KDOD asset generation? (y/n): " is_kdod

# Build assets
echo "Building Taifa Care KenyaEMR 3.x assets ..."
CWD=$(pwd)
npx --legacy-peer-deps openmrs@next build \
  --build-config ./frontend-config/staging/hie_build-config.json \
  --target ./frontend \
  --page-title "Taifa Care - KenyaEMR" \
  --support-offline false

# Assemble assets
echo "Assembling assets ..."
npx --legacy-peer-deps openmrs@next assemble \
  --manifest \
  --mode config \
  --config ./frontend-config/staging/hie_build-config.json \
  --target ./frontend

# Copy required files
echo "Copying required files ..."
cp "${CWD}/assets/taifa_care/kenyaemr-login-logo.png" "${CWD}/frontend"
cp "${CWD}/assets/taifa_care/kenyaemr-primary-logo.svg" "${CWD}/frontend"
cp "${CWD}/assets/taifa_care/favicon.ico" "${CWD}/frontend"
cp "${CWD}/frontend-config/staging/kenyaemr.config.json" "${CWD}/frontend"
cp "${CWD}/frontend-config/staging/openmrs.config.json" "${CWD}/frontend"

# Copy KDOD config or registration config based on user input and update index.html
if [ "$is_kdod" = "y" ] || [ "$is_kdod" = "Y" ]; then
    echo "Copying KDOD configuration..."
    cp "${CWD}/frontend-config/registration/kdod.config.json" "${CWD}/frontend"
    
    # Update the configUrls in index.html
    sed -i.bak 's/configUrls: \[/configUrls: \["${openmrsSpaBase}\/kdod.config.json", /' "${CWD}/frontend/index.html" && rm "${CWD}/frontend/index.html.bak"
else
    echo "Copying registration configuration..."
    cp "${CWD}/frontend-config/registration/registration.config.json" "${CWD}/frontend"
    
    # Update the configUrls in index.html
    sed -i.bak 's/configUrls: \[/configUrls: \["${openmrsSpaBase}\/registration.config.json", /' "${CWD}/frontend/index.html" && rm "${CWD}/frontend/index.html.bak"
fi

# Function to handle the renaming process
rename_dist_folder() {
    local pattern=$1
    local dist_folder_name=$2
    local folder_name=$(find frontend -name "$pattern" -type d | head -n 1 | sed 's|frontend/||')

    # Check if the folder_name is not empty
    if [ -n "$folder_name" ]; then
        # Check if the specific 'dist' directory exists
        if [ -d "$dist_folder_name" ]; then
            # Rename the specific 'dist' directory to the found folder name
            mv "$dist_folder_name" "$folder_name"
            echo "The '$dist_folder_name' directory has been renamed to '$folder_name'"

            # Now copy the renamed folder back into the 'frontend' directory
            cp -r "$folder_name" frontend/
            echo "The renamed folder has been copied back into the 'frontend' directory."
            mv "$folder_name" "$dist_folder_name"
        else
            echo "The '$dist_folder_name' directory does not exist in the expected location."
        fi
    else
        echo "No directory matching the pattern '$pattern' was found within the 'frontend' directory."
    fi
}

# Handle renaming for openmrs-esm-form-entry-app-*
rename_dist_folder "openmrs-esm-form-entry-app-*" "dist-form-entry"

# Exit with success status
exit 0
