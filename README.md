# OpenMRS config for the OpenMRS distribution for KenyaEMR

This is the OpenMRS backend configuration for the [OpenMRS distribution KenyaEMR](https://github.com/openmrs/openmrs-distro-kenyaemr).

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
