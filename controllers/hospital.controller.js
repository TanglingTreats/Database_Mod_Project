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
    const hospial = new Hospital({
      name: req.body.name,
      location: req.body.location,
    });
  
    // Save hospital record into the database
    Hospital.create(customer, (err, data) => {
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
