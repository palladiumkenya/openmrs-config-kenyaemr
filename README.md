# OpenMRS config for the OpenMRS distribution for KenyaEMR

![KenyaEMR OpenMRS 3.x Deployment](https://github.com/palladiumkenya/openmrs-config-kenyaemr/workflows/KenyaEMR%20CI/badge.svg) ![Github All Releases](https://img.shields.io/github/downloads/palladiumkenya/kenyahmis-releases/total.svg) ![GitHub Downloads (all assets, latest release)](https://img.shields.io/github/downloads/palladiumkenya/kenyahmis-releases/latest/total)


This is the OpenMRS backend configuration for the OpenMRS distribution KenyaEMR.

This configuration is designed to be loaded by:

- The [Initializer module](https://github.com/mekomsolutions/openmrs-module-initializer)
- The [Address Hierarchy module](https://github.com/openmrs/openmrs-module-addresshierarchy)

---

## Instructions

To build assets for deployment:

1. Install Node.js v16 or above on your system from [Node.js website](https://nodejs.org/en/download).
2. Two scripts are available to generate frontend assets for deployment: one for the development environment and one for production.

   ### Run production build

   ```sh
   sh prod-build.sh
   ```

   ### Run dev build

   ```sh
   sh dev-build.sh
   ```

   Both scripts generate frontend assets for deployment. Note that for the production build, the `configURL` in `index.html` must be updated, and the `config.json` file must be updated to include the deployed server `url`. For example, for our test instance, the `index.html` `configURL` is `http://197.248.44.226:8500/openmrs/spa/config.json`.

3. The built assets are located in a folder named `frontend`. Copy these files to the frontend directory, for example, `/var/lib/OpenMRS`.

Please note that our work on patient-registration and esm-login contain custom changes and require updating the respective JavaScript assets:

- [Patient Registration](https://github.com/openmrs/openmrs-esm-patient-management/tree/feat/client-registry)
- [Login](https://github.com/donaldkibet/openmrs-esm-core/tree/KenyaEMR)

## Instructions on setting KenyaEMR using the docker compose file

1. Download the version of KenyaEMR you want to run from github release [latest](https://github.com/palladiumkenya/kenyahmis-releases/releases)

2. Spin up the docker compose file by running
   ```sh
   docker compose up -d
   ```
3. Get the containers id. By running the above command two containers are spinned up namely:

   mysql-container

   tomcat-container

   ```sh
   docker ps
   ```

4. Copy the modules folder and `openmrs.war` file to tomcat container

   ```sh
   docker cp modules <containerID>:/usr/local/tomcat
   docker cp openmr.war <containerId>:/usr/local/tomcat/webapps
   ```

5. Copy `demo.sql` database file to mysql container. This is back-up file of an existing instance

   ```sh
   docker cp demo.sql <containerID>:/home
   ```

6. Execute the following sql in mysql container file

   ```sh
   docker exec -it <MySQLContaineID> bash
   ```

   Once in the container

   ```sql
   mysql -u root -p
   ```

   ```sql
   create database openmrs;
   use openmrs;
   source /path-to-mysql-demo.sql
   grant all privileges on *.* to 'openmrs_user'@'%';flush privileges;use openmrs;delete from liquibasechangelog where id like '%charts%';where id like '%charts%';
   ```

   Run this stored procedures to create etl tables for KenyaEMR

   ```sql
   call create_etl_tables();
   call sp_first_time_setup();
   ```

7. Restart both container sequentially, important to note that restart mysql-container first then tomcat container after

   ```sh
   docker restart <MySQLContainerID>
   docker restart <TomcatContainerID>
   ```
