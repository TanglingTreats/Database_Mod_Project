const Patient = require("../../models/mongo/patient.model.js");

// Create and Save a new patient record
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a Patient record
    const patient = new Patient({
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,

    });
  
    // Save Patient into the database
    Patient.create(patient, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating new patient record."
        });
      else res.send(data);
    });
  };

// Retrieve all Patient record from the database.
exports.findAll = (req, res) => {
    Patient.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving patient records."
        });
      else res.send(data);
    });
  };

// Find a single Patient record with a PatientId
exports.findOne = (req, res) => {
    Patient.findByPatientId(req.params.patientId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Patient record with patientId ${req.params.patientId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Patient record with patientId " + req.params.patientId
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
  
    Patient.updateById(
      req.params.patientId,
      new Patient(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Patient record with patientId ${req.params.patientId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Patient record with patientId " + req.params.patientId
            });
          }
        } else res.send(data);
      }
    );
  };

  exports.delete = (req, res) => {
    Patient.remove(req.params.patientId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Patient with id ${req.params.patientId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Patient record with id " + req.params.patientId
          });
        }
      } else res.send({ message: `Patient record was deleted successfully!` });
    });
  };

  exports.deleteAll = (req, res) => {
    Patient.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all Patient record."
        });
      else res.send({ message: `All Patient record were deleted successfully!` });
    });
  };