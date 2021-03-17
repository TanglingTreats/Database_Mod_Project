const path = require('path');
const express = require('express')
const app = express()
const port = 8000;

app.use(express.static(path.join(__dirname, 'src')));

// parse requests of content-type: application/json
app.use(express.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("./routes/hospital.routes.js")(app);
require("./routes/covid19_details.routes.js")(app);
require("./routes/doctor.routes.js")(app);
require("./routes/medical_record.routes.js")(app);

// Define routes here 
app.get('/', (req, res) => {
    res.send("index.html")
});

app.listen(port, () => {
    console.log(`Database app  listening on part ${port}!`)
});


// Run sqlscript file
// sqlcmd -S myServer\instanceName -i C:\myScript.sql

