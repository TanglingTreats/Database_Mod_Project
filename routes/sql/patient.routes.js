module.exports = app => {
    const patient = require("../../controllers/sql/patient.controller.js");
  
    // Create a new patient record
    app.post("/api/createPatient", patient.create);
  
    // Retrieve all patient record
    app.get("/api/getAllPatients", patient.findAll);
  
    // Retrieve a single patient with patientId
    app.get("/api/getPatient/:patientId", patient.findOne);

    // Update patient with patientId
    app.put("/api/updatePatient/:patientId", patient.update);

    // Delete patient record with patientId
    app.delete("/api/removePatient/:patientId", patient.delete);
  
    // Delete all patient record
    // DO NOT CALL UNLESS OTHERWISE NECESSARY
    app.delete("/api/clearPatientRecords", patient.deleteAll);
  };