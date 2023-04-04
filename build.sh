#! /bin/bash

echo "Building Kenya EMR 3.x assests ..."

rm -rf openmrs-config-kenyaemr
rm -rf spa

CWD=$(pwd)

echo 

npx --legacy-peer-deps openmrs@next build --build-config ./configuration/spa-build-config.json --target ./spa --page-title KenyaEMR  --support-offline false
npx --legacy-peer-deps openmrs@next assemble --manifest --mode config --config ./configuration/spa-build-config.json --target ./spa

git clone https://github.com/palladiumkenya/openmrs-config-kenyaemr.git

# remove OpenMRS favicon

rm -rf ${CWD}/assets/favicon.ico

cp ${CWD}/openmrs-config-kenyaemr/assets/kenyaemr-login-logo.png ${CWD}/spa
cp ${CWD}/openmrs-config-kenyaemr/assets/kenyaemr-primary-logo.png ${CWD}/spa
cp ${CWD}/openmrs-config-kenyaemr/assets/favicon.ico ${CWD}/spa
cp ${CWD}/configuration/config.json ${CWD}/spa
