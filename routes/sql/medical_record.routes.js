module.exports = app => {
    const medical_record = require("../../controllers/sql/medical_record.controller.js");
  
    // Create a new medical record
    app.post("/api/medical_record", medical_record.create);
  
    // Retrieve all medical record
    app.get("/api/medical_record", medical_record.findAll);
  
    // Retrieve a single medical record with patientId
    app.get("/api/medical_record/:patientId", medical_record.findOne);

    // Update medical record with patientId
    app.put("/api/medical_record/:patientId", medical_record.update);

    // Delete medical record with patientId
    app.delete("/api/medical_record/:patientId", medical_record.delete);
  
    // Delete all medical record
    app.delete("/api/medical_record", medical_record.deleteAll);
  };