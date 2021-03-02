const path = require('path');
const express = require('express')
const app = express()
const port = 8000;

app.use(express.static(path.join(__dirname, 'src')));

require("./routes/hospital.routes.js")(app);

// Define routes here 
app.get('/', (req, res) => {
    res.send("index.html")
});

app.listen(port, () => {
    console.log(`Database app  listening on part ${port}!`)
});


// Run sqlscript file
// sqlcmd -S myServer\instanceName -i C:\myScript.sql

