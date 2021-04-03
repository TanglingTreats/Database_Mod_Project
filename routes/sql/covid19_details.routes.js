module.exports = app => {
    const covid19_details = require("../../controllers/covid19_details.controller.js");
  
    // Create a new covid19 details
    app.post("/api/covid19_details", covid19_details.create);
  
    // Retrieve all covid19 details
    app.get("/api/covid19_details", covid19_details.findAll);
  
    // Retrieve a single covid19 details with CovidId
    app.get("/api/covid19_details/:covidId", covid19_details.findOne);

    // Update covid19 details with CovidId
    app.put("/api/covid19_details/:covidId", covid19_details.update);

    // Delete covid19 details with CovidId
    app.delete("/api/covid19_details/:covidId", covid19_details.delete);
  
    // Delete all covid19 details
    app.delete("/api/covid19_details", covid19_details.deleteAll);
  };