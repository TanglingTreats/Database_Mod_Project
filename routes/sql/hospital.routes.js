module.exports = app => {
    const hospital = require("../controllers/hospital.controller.js");
  
    // Create a new hospital record
    app.post("/api/hospital", hospital.create);
  
    // Retrieve all Hosptial record
    app.get("/api/hospital", hospital.findAll);
  
    // Retrieve a single hospital with HospitalId
    app.get("/api/hospital/:hospitalId", hospital.findOne);

    // Update hospital with hospitalId
    app.put("/api/hospital/:hospitalId", hospital.update);

    // Delete hospital record with hospitalID
    app.delete("/api/hospital/:hospitalId", hospital.delete);
  
    // Delete all hospital record
    app.delete("/api/hospital", hospital.deleteAll);
  };