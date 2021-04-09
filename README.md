# Database_Mod_Project
Just a project in a module

# Instructions for running the project
Ensure that both MariaDB and MongoDB have been installed in the system and the services are running.

Execute the CSC2008_Hospital.sql script to populate the SQL database.

Run ```python python/migration.py``` to migrate the data over from MariaDB to MongoDB

Run ```python python/data-gen.py``` to start generating random data based on existing data in the DB.

```npm install``` in the project directory to install necessary node modules.

```npm start``` in the project directory to run the project. Open a browser to get to the specified address to access it.

To change between MaridaDB or MongoDB, change the configuration within package.json.
```
"config":{
  "dbType": <value> where value can be "sql" or "mongo"
}
```
