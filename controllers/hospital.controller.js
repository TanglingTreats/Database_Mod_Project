const Hospital = require("../models/hospital.model.js");

// Create and Save a new hospital record
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a hospital record
    const hospital = new Hospital({
      hos_name: req.body.hos_name,
      hos_location: req.body.hos_location,
    });
  
    // Save hospital record into the database
    Hospital.create(hospital, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating new hospital record."
        });
      else res.send(data);
    });
  };

// Retrieve all hospital details from the database.
exports.findAll = (req, res) => {
    Hospital.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Hospital records."
        });
      else res.send(data);
    });
  };

// Find a single hospital details with a hospitalId
exports.findOne = (req, res) => {
    Hospital.findByHospitalId(req.params.hospitalId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Hospital record with id ${req.params.hospitalId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Hosptial record with id " + req.params.hospitalId
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
  
    Hospital.updateById(
      req.params.hospitalId,
      new Hospital(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Hospital with id ${req.params.hospitalId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Hospital with id " + req.params.hospitalId
            });
          }
        } else res.send(data);
      }
    );
  };

  exports.delete = (req, res) => {
    Hospital.remove(req.params.hospitalId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found hospital with id ${req.params.hospitalId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete hospital record with id " + req.params.hospitalId
          });
        }
      } else res.send({ message: `Hospital record was deleted successfully!` });
    });
  };

  exports.deleteAll = (req, res) => {
    Hospital.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all hospital record."
        });
      else res.send({ message: `All hospital record were deleted successfully!` });
    });
  };