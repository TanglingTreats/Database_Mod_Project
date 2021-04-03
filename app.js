const path = require('path');
const express = require('express')
const app = express()
const port = 8000;

console.log(process.env.npm_package_config_dbType);
var dbType = process.env.npm_package_config_dbType; 

app.use(express.static(path.join(__dirname, '/src/')));
app.use(express.static(path.join(__dirname, '/src/assets')));

// parse requests of content-type: application/json
app.use(express.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

switch(dbType) {
    case "sql":
        require("./routes/"+dbType+"/hospital.routes.js")(app);
        require("./routes/"+dbType+"/covid19_details.routes.js")(app);
        require("./routes/"+dbType+"/doctor.routes.js")(app);
        require("./routes/"+dbType+"/medical_record.routes.js")(app);
        require("./routes/"+dbType+"/patient.routes.js")(app);
        require("./routes/"+dbType+"/patient_vitals.routes.js")(app);
        require("./routes/"+dbType+"/room.routes.js")(app);
        require("./routes/"+dbType+"/ward_record.routes.js")(app);
        break;
    case "mongo":
        console.log("Mongo");
        break;
}

// Define routes here 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/index.html'));
});

app.listen(port, () => {
    console.log(`Database app  listening on part ${port}!`)
});


// Run sqlscript file
// sqlcmd -S myServer\instanceName -i C:\myScript.sql

