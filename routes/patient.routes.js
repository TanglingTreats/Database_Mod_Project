module.exports = app => {
    const patient = require("../controllers/patient.controller.js");
  
    // Create a new patient record
    app.post("/api/patient", patient.create);
  
    // Retrieve all patient record
    app.get("/api/patient", patient.findAll);
  
    // Retrieve a single patient with patientId
    app.get("/api/patient/:patientId", patient.findOne);

    // Update patient with patientId
    app.put("/api/patient/:patientId", patient.update);

    // Delete patient record with patientId
    app.delete("/api/patient/:patientId", patient.delete);
  
    // Delete all patient record
    app.delete("/api/patient", patient.deleteAll);
  };