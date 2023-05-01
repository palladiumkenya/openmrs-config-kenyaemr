# Cron Job for Deleting Old Frontend Assets

This guide explains how to set up a cron job that deletes frontend assets older than 7 days from the backup directory on your server.

## Prerequisites

1. A Linux-based server with access to the command line
2. The cron utility installed on the server


## Steps
1. Create a shell script to delete old assets
   
   Create a new shell script named delete_old_assets.sh in your preferred directory on the server. Add the following content to the script:


   ```sh
   #!/bin/bash

    # Set the backup directory path
    backup_directory="/home/developers/backup"

    # Find and delete assets older than 7 days
    find "$backup_directory" -type d -name "frontend_old_*" -mtime +7 -exec rm -rf {} \;
    ```
    This script finds and deletes directories within the backup_directory that have names starting with frontend_old_ and are older than 7 days.


2. Make the script executable

    Give the script executable permissions by running the following command in the terminal:

    ```sh
    chmod +x delete_old_assets.sh
    ```
        

3. Add a new cron entry to run the script daily

    Open the crontab editor for the current user by running the following command:

    
    ```
    crontab -e
    ```

    Add the following line at the end of the file, replacing /path/to/script with the actual path to the delete_old_assets.sh script:

    ```sh
    0 0 * * * /path/to/script/delete_old_assets.sh
    ```

    This cron entry will execute the script daily at midnight (00:00).

    Save the changes and exit the editor.

4. Verify the cron job

    You can list your current cron jobs by running:

    ```sh
    crontab -l
    ```