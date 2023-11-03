#!/bin/bash
# Script to backup MySQL databases

#script directory
current_dir=$(pwd)
script_dir=$(dirname $0)

if [ $script_dir = '.' ]
then
script_dir="$current_dir"
fi
echo script_directory: ${script_dir}

# MySQL settings
mysql_user="root"
mysql_password="test"
mysql_base_database="openmrs"



# Read MySQL password from stdin if empty
if [ -z "${mysql_password}" ]; then
  echo -n "Enter MySQL ${mysql_user} password: "
  read -s mysql_password
  echo
fi

# Check MySQL password
echo exit | mysql --user=${mysql_user} --password=${mysql_password} -B 2>/dev/null
if [ "$?" -gt 0 ]; then
  echo "MySQL ${mysql_user} password incorrect"
  exit 1
else
  echo "MySQL ${mysql_user} password correct."
fi
echo



echo "Truncate appointments if any to dump afresh"
mysql --user=${mysql_user} --password=${mysql_password} ${mysql_base_database} < "${script_dir}/scripts/HIV/truncate_appointment.sql" 


echo "Update HIV followup appointments"
mysql --user=${mysql_user} --password=${mysql_password} ${mysql_base_database} < "${script_dir}/scripts/HIV/First_script_HIV_Followup.sql" 

echo "Update HIV drug refill appointments"
mysql --user=${mysql_user} --password=${mysql_password} ${mysql_base_database} < "${script_dir}/scripts/HIV/Second_script_refill.sql" 

echo "Create relationship between Follow up and drug refill appointments"
mysql --user=${mysql_user} --password=${mysql_password} ${mysql_base_database} < "${script_dir}/scripts/HIV/Third_script_relate_follow_refill.sql" 
echo

echo "Create other appointments i.e MCH, PREP, KP and CWC"
mysql --user=${mysql_user} --password=${mysql_password} ${mysql_base_database} < "${script_dir}/scripts/other_appointments/other_appointments.sql" 
echo

echo "Finished updating appointments"
echo

echo "Creating etl tables"
mysql -u ${mysql_user} -p ${mysql_base_database} -e "CALL create_etl_tables()"
mysql -u ${mysql_user} -p ${mysql_base_database} -e "CALL sp_first_time_setup()"

echo "Finished updating etl tables"





