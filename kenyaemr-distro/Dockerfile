# Use the Ubuntu 20.04 base image
FROM ubuntu:20.04

# Set environment variables for MariaDB
ENV MARIADB_ROOT_PASSWORD=test
ENV MARIADB_DATABASE=openmrs
ENV MARIADB_USER=root
ENV MARIADB_PASSWORD=test

# Update package list and install necessary packages
RUN apt-get update && apt-get install -y \
    wget \
    lsb-release \
    gnupg \
    apt-utils \
    tzdata \
    openjdk-8-jdk \
    software-properties-common

# Set timezone
RUN ln -fs /usr/share/zoneinfo/UTC /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata

# Install MariaDB
RUN apt-get install -y mariadb-server

# Install Tomcat 9 and additional packages
RUN apt-get install tomcat9 -y && \
    apt-get install tomcat9-docs tomcat9-examples tomcat9-admin -y

# Set the CATALINA_HOME environment variable
ENV CATALINA_HOME /usr/share/tomcat9

# Create a symbolic link to the correct configuration folder
RUN ln -s /etc/tomcat9 $CATALINA_HOME/conf

# Copy OpenMRS modules and WAR file
COPY modules /var/lib/OpenMRS/modules
COPY openmrs.war $CATALINA_HOME/webapps/openmrs.war

# Copy SQL file for database setup
COPY demo-data.sql /demo-data.sql

# Change ownership of the OpenMRS folder
RUN chown -R tomcat:tomcat /var/lib/OpenMRS/

# Start MariaDB, configure the database, and apply the SQL file
RUN service mysql start && \
    sleep 10 && \
    mysql -u root -e "SET PASSWORD FOR 'root'@'localhost' = PASSWORD('test');" \
    mysql -u root -p${MARIADB_ROOT_PASSWORD} -e "CREATE DATABASE ${MARIADB_DATABASE};" && \
    mysql -u root -p${MARIADB_ROOT_PASSWORD} -e "USE openmrs; SOURCE /demo-data.sql;DELETE FROM liquibasechangelog where id like 'kenyaemrChart%'"

# Expose MariaDB and Tomcat ports
EXPOSE 3306 8080

# Start MariaDB and Tomcat services
CMD service mysql start && $CATALINA_HOME/bin/catalina.sh run
