#!/bin/bash

# Load nvm into the current session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Function to install Node.js version 18 using nvm
install_node_18() {
    echo "Installing Node.js version 18..."
    nvm install 18
    nvm use 18
    nvm alias default 18
}

# Check if Node.js version 18 is installed
if nvm ls 18 &>/dev/null; then
    echo "Node.js version 18 is already installed."
    nvm use 18
else
    install_node_18
fi


# Build KenyaEMR Production assets
sh dev-build.sh


# Compress generate frontend assets
rm -rf frontend.tar.gz
echo
echo Compressing frontend directory to frontend.tar.gz
tar -czf frontend.tar.gz frontend
echo Complete compressing frontend directory
echo


# Make directory for KenyaEMR 3.x Assets
# Prompt the user for a version number
read -p "Enter the version number: " version

# Get the current date in DDD-MM-YYYY format
date_str=$(date "+%a-%d-%b-%Y")

# Ensure the abbreviations are in uppercase
date_str=$(echo "$date_str" | tr '[:lower:]' '[:upper:]')

# Define the base directory name
base_dir="KENYAEMR3.x"

# Create a new directory name with the version number and the date appended
dir_name="${base_dir}_v${version}_${date_str}"
rm -rf "$dir_name"
# Check if the directory already exists
if [ -d "$dir_name" ]; then
    rm -rf "$dir_name"
else
    # Create the directory
    mkdir "$dir_name"
    echo "Directory '$dir_name' has been created."
fi
echo

# Copy the distro assets for deployment
echo
echo "Copying distro assets to $dir_name..."

# Create a fresh configuration directory
echo "Creating configuration directory..."
mkdir "$dir_name"/configuration

# Copy the configuration, backend, and frontend files to the target directory
echo "Copying configuration files..."
cp -r configuration/* "$dir_name"/configuration

echo "Copying backend files..."
cp -r backend/* "$dir_name"

modules_path="$dir_name/modules"

# Check if the modules directory exists
if [ -d "$modules_path" ]; then
    echo "Compressing the 'modules' directory..."
    tar -czf "$dir_name/modules.tar.gz" -C "$dir_name" modules
    echo "Compression complete. Deleting the 'modules' directory..."
    rm -rf "$modules_path"
    echo "'modules' directory deleted."
else
    echo "'modules' directory does not exist. Skipping compression and deletion."
fi
echo

echo "Copying frontend file..."
cp frontend.tar.gz "$dir_name"

echo Deleting create compressed frontend assets
rm -rf frontend.tar.gz
echo

echo Compresssing Distro assets
tar -czf "$dir_name".tar.gz "$dir_name"

echo "Distro assets copied successfully."