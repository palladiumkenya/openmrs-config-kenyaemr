#!/bin/bash

# Set the backup directory path
backup_directory="/home/developers/backup"

# Find and delete assets older than 7 days
find "$backup_directory" -type d -name "frontend_old_*" -mtime +7 -exec rm -rf {} \;
