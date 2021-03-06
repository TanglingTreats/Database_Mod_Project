module.exports = app => {
    const patient_vitals = require("../../controllers/mongo/patient_vitals.controller.js");
  
    // Create a new patient vitals record
    app.post("/api/patient_vitals", patient_vitals.create);
  
    // Retrieve all patient vitals record
    app.get("/api/patient_vitals", patient_vitals.findAll);
  
    // Retrieve all records of a single patient
    app.get("/api/get_patient_vitals/:pId", patient_vitals.findByPatient);

    // Retrieve a single patient vitals with patient vitalID
    app.get("/api/patient_vitals/:pvId", patient_vitals.findOne);

    // Update patient vitals with patient vitalID
    app.put("/api/patient_vitals/:pvId", patient_vitals.update);

    // Delete patient vitals with patient vitalID
    app.delete("/api/patient_vitals/:pvId", patient_vitals.delete);
  
    // Delete all patient vitals record
    app.delete("/api/patient_vitals", patient_vitals.deleteAll);
  };