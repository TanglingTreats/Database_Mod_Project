const Covid19_details = require("../../models/covid19_details.model.js");

// Create and Save a new covid19 details record
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a new covid19 details 
    const covid19_details = new Covid19_details({
      is_positive: req.body.is_positive,
      infected_date: req.body.infected_date,
      last_tested: req.body.last_tested,
      injection_date: req.body.injection_date,
      condition_status: req.body.condition_status
    });
  
    // Save Covid19 details into the database
    Covid19_details.create(covid19_details, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating new Covid19 details."
        });
      else res.send(data);
    });
  };

// Retrieve all Covid19 details from the database.
exports.findAll = (req, res) => {
    Covid19_details.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Covid19 details."
        });
      else res.send(data);
    });
  };

// Find a single Covid19 details  with a covidId
exports.findOne = (req, res) => {
  Covid19_details.findByCovidId(req.params.covidId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Covid19 details with id ${req.params.covidId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Covid19 details with id " + req.params.covidId
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
  
    Covid19_details.updateById(
      req.params.covidId,
      new Covid19_details(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Covid19 details with id ${req.params.covidId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Covid19 details with id " + req.params.covidId
            });
          }
        } else res.send(data);
      }
    );
  };

  exports.delete = (req, res) => {
    Covid19_details.remove(req.params.covidId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Covid19 details with id ${req.params.covidId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Covid19 details with id " + req.params.covidId
          });
        }
      } else res.send({ message: `Covid19 details was deleted successfully!` });
    });
  };

  exports.deleteAll = (req, res) => {
    Covid19_details.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all Covid19 details record."
        });
      else res.send({ message: `All Covid19 details were deleted successfully!` });
    });
  };