module.exports = app => {
    const hospital = require("../controllers/hospital.controller.js");
  
    // Create a new hospital record
    app.post("/hospital", hospital.create);
  
    // Retrieve all Hosptial details
    app.get("/hospital", hospital.findAll);
  
    // Retrieve a single hospital with HospitalId
    app.get("/hospial/:hospitalId", hospital.findOne);

  };