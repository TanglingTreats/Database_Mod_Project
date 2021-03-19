module.exports = app => {
    const ward_record = require("../controllers/ward_record.controller.js");
  
    // Create a new ward record
    app.post("/api/ward_record", ward_record.create);
  
    // Retrieve all ward record
    app.get("/api/ward_record", ward_record.findAll);
  
    // Retrieve a ward with wardId
    app.get("/api/ward_record/:wardId", ward_record.findOne);

    // Update ward with wardId
    app.put("/api/ward_record/:wardId", ward_record.update);


    // Delete ward record with wardId
    app.delete("/api/ward_record/:wardId", ward_record.delete);
  
    // Delete all ward record
    app.delete("/api/ward_record", ward_record.deleteAll);
  };