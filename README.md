# OpenMRS config for the OpenMRS distribution for KenyaEMR

![KenyaEMR OpenMRS 3.x Deployment](https://github.com/palladiumkenya/openmrs-config-kenyaemr/workflows/KenyaEMR%20CI/badge.svg)

This is the OpenMRS backend configuration for the [OpenMRS distribution KenyaEMR](http://197.248.44.226:8500/openmrs/spa/login).

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


## KenyaEMR Docker Guide

This README provides a step-by-step guide to spin up an instance of KenyaEMR using Docker.

### Prerequisites

Ensure that you have the following software installed on your system:
- [Docker](https://www.docker.com/)


### Steps to Set Up KenyaEMR Docker Instance

1. Navigate to the kenyaemr-distro folder:

   Change to the kenyaemr-distro directory which contains the Dockerfile.
2. Build the KenyaEMR Docker image:
   
   Execute the following command to build the Docker image. 
   
   Replace <version> with the desired version number or latest for the most recent version.

   ```sh
   docker build -t kenyaemr-distro:<version> .
   ```
3. Run the KenyaEMR Docker container:

   Use the following command to run the Docker container. 
   
   Replace <version> with the version number used in the previous step.

   ```sh
   docker run --name kenyaemr-distro -p 3306:3306 -p 8080:8080 -d kenyaemr-distro:<version>
   ```

   This will create and run a container named kenyaemr-distro, with the MySQL database 
   
   listening on port 3306 and the KenyaEMR application accessible on port 8080.

4. Access KenyaEMR Instance

   Once the container is up and running, you can access the KenyaEMR application by opening a web browser and navigating to:

   KenyaEMR 2.x

   [http://localhost:8080/openmrs](http://localhost:8080/openmrs)

   
   KenyaEMR 3.x

   [http://localhost:8080/openmrs/spa](http://localhost:8080/openmrs/spa)
