const Medical_record = require("../../models/medical_record.model.js");

// Create and Save a new medical record
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a medical record
    const medical_record = new Medical_record({
      mr_date: req.body.mr_date,
      appt_type: req.body.appt_type,
      illness: req.body.illness
    });
  
    // Save medical record into the database
    Medical_record.create(medical_record, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating new medical record."
        });
      else res.send(data);
    });
  };

// Retrieve all medical record from the database.
exports.findAll = (req, res) => {
    Medical_record.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving medical records."
        });
      else res.send(data);
    });
  };

// Find a single medical record with a PatientId
exports.findOne = (req, res) => {
    Medical_record.findByPatientId(req.params.patientId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Medical record with patientId ${req.params.patientId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Medical record with patientId " + req.params.patientId
          });
        }
      } else res.send(data);
    });
  };

  exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    Medical_record.updateById(
      req.params.patientId,
      new Medical_record(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Medical record with patientId ${req.params.patientId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Medical record with patientId " + req.params.patientId
            });
          }
        } else res.send(data);
      }
    );
  };

  exports.delete = (req, res) => {
    Medical_record.remove(req.params.patientId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Medical_record with id ${req.params.patientId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Medical record with id " + req.params.patientId
          });
        }
      } else res.send({ message: `Medical record was deleted successfully!` });
    });
  };

  exports.deleteAll = (req, res) => {
    Medical_record.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all medical record."
        });
      else res.send({ message: `All Medical record were deleted successfully!` });
    });
  };