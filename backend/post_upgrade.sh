
#!/bin/bash
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

echo "=== updating KenyaEMR IL module configurations ==="
kenyaemr_il_configs="${script_dir}/scripts/kenyaemr_il/kenyaemr_il_configs.sql"
echo
echo "Executing SQL script: $sql_script"
echo
# Execute SQL script
if ! mysql --user="$mysql_user" --password="$mysql_password" "$mysql_base_database" < "$kenyaemr_il_configs"; then
    echo "Error: Failed to execute kenyaemr_il_configs SQL script" >&2
    exit 1
fi

echo
echo "=== updating address hierarch configurations ==="
address_hierarchy_script="${script_dir}/scripts/address_hierarchy/address_hierarchy.sql"
echo
echo "Executing SQL script: $sql_script"
echo
# Execute SQL script
if ! mysql --user="$mysql_user" --password="$mysql_password" "$mysql_base_database" < "$address_hierarchy_script"; then
    echo "Error: Failed to execute address_hierarchy_script SQL script" >&2
    exit 1
fi