const Patient_vitals = require("../models/patient_vitals.model.js");

// Create and Save a new Patient vitals record
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a Patient vitals record
    const patient_vitals = new Patient_vitals({
      heart_rate: req.body.heart_rate,
      systolic_bp: req.body.blood_pressure,
      diastolic_bp: req.body.blood_pressure,
      temperature: req.body.temperature,

    });
  
    // Save Patient vitals into the database
    Patient_vitals.create(patient_vitals, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating new patient vitals record."
        });
      else res.send(data);
    });
  };

// Retrieve all Patient vitals record from the database.
exports.findAll = (req, res) => {
  Patient_vitals.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Patient vitals records."
        });
      else res.send(data);
    });
  };

exports.findByPatient = (req, res) => {
  Patient_vitals.findByPId(req.params.pId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Patient vital record with patient Id ${req.params.pId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Patient vital record with patient Id " + req.params.pId
          });
        }
      } else res.send(data);
  });
}

// Find a single Patient vitals record with a PvId
exports.findOne = (req, res) => {
  Patient_vitals.findByPvId(req.params.pvId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Patient record with patient vitalId ${req.params.pvId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Patient record with vitalId " + req.params.pvId
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
  
    Patient_vitals.updateById(
      req.params.pvId,
      new Patient_vitals(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Patient record with patient vitalId ${req.params.pvId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Patient record with patient vitalId " + req.params.pvId
            });
          }
        } else res.send(data);
      }
    );
  };

  exports.delete = (req, res) => {
    Patient_vitals.remove(req.params.pvId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Patient with vitalId ${req.params.pvId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Patient record with vitalId " + req.params.pvId
          });
        }
      } else res.send({ message: `Patient record was deleted successfully!` });
    });
  };

  exports.deleteAll = (req, res) => {
    Patient_vitals.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all Patient vitals record."
        });
      else res.send({ message: `All Patient vitals record were deleted successfully!` });
    });
  };