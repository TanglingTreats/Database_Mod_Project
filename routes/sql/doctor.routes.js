module.exports = app => {
    const doctor = require("../../controllers/sql/doctor.controller.js");
  
    // Create a new doctor record
    app.post("/api/doctor", doctor.create);
  
    // Retrieve all doctor record
    app.get("/api/doctor", doctor.findAll);
  
    // Retrieve a single doctor with doctorId
    app.get("/api/doctor/:doctorId", doctor.findOne);

    // Update doctor with doctorId
    app.put("/api/doctor/:doctorId", doctor.update);

    // Delete doctor record with doctorId
    app.delete("/api/doctor/:doctorId", doctor.delete);
  
    // Delete all doctor record
    app.delete("/api/doctor", doctor.deleteAll);
  };