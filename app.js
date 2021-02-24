const path = require('path');
const express = require('express')
const app = express()
const port = 8000;

app.use(express.static(path.join(__dirname, 'src')));

// Define routes here 
app.get('/', (req, res) => {
    res.send("index.html")
});

app.listen(port, () => {
    console.log(`Database app  listening on part ${port}!`)
});
