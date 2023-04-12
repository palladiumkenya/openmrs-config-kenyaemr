# OpenMRS config for the <br>_OpenMRS distribution for KenyaEMR_
This is the OpenMRS backend configuration for the [_OpenMRS distribution KenyaEMR_]
This configuration is designed to be loaded by
- The [Initializer module](https://github.com/mekomsolutions/openmrs-module-initializer), and
- The [Address Hierarchy module](https://github.com/openmrs/openmrs-module-addresshierarchy). 

---

# Instructions 

To build assets for deployment

- Install node js in your system v16 and above [NodeJS](https://nodejs.org/en/download)
- Run 
    ```bash
        sh build.sh
    ```

The built assets are located in a folder named `frontend`
copy this files to the frontend directory e.g `/var/lib/OpenMRS`

Keep in mind our work on patient-registration and esm-login contain custom changes therefore require update of the respective 
JS assets
- [Patient Registration](https://github.com/openmrs/openmrs-esm-patient-management/tree/feat/client-registry)
- [Login](https://github.com/donaldkibet/openmrs-esm-core/tree/KenyaEMR)