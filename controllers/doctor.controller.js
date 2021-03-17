const Doctor = require("../models/doctor.model.js");

// Create and Save a new doctor details
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a doctor details
    const doctor = new Doctor({
      doctor_name: req.body.doctor_name
    });
  
    // Save doctor details into the database
    Doctor.create(doctor, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating new doctor record."
        });
      else res.send(data);
    });
  };

// Retrieve all doctor details from the database.
exports.findAll = (req, res) => {
    Doctor.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving doctor records."
        });
      else res.send(data);
    });
  };

// Find a single doctor details with a doctorId
exports.findOne = (req, res) => {
    Doctor.findByDoctorId(req.params.doctorId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Doctor record with id ${req.params.doctorId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Doctor record with id " + req.params.doctorId
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
  
    Doctor.updateById(
      req.params.doctorId,
      new Doctor(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Doctor with id ${req.params.doctorId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Doctor with id " + req.params.doctorId
            });
          }
        } else res.send(data);
      }
    );
  };

  exports.delete = (req, res) => {
    Doctor.remove(req.params.doctorId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found doctor with id ${req.params.doctorId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete doctor record with id " + req.params.doctorId
          });
        }
      } else res.send({ message: `Doctor record was deleted successfully!` });
    });
  };

  exports.deleteAll = (req, res) => {
    Doctor.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all doctor record."
        });
      else res.send({ message: `All doctor record were deleted successfully!` });
    });
  };