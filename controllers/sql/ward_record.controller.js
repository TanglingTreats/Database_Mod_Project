const Ward_record = require("../../models/ward_record.model.js");

// Create and Save a new room record
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a room record
    const ward_record = new Ward_record({
      start_date: req.body.room_no,
      end_date: req.body.ward,
      duration: req.body.duration

    });
  
    // Save ward into the database
    Ward_record.create(ward_record, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating new ward record."
        });
      else res.send(data);
    });
  };

// Retrieve all ward record from the database.
exports.findAll = (req, res) => {
  Ward_record.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving ward records."
        });
      else res.send(data);
    });
  };

// Find a single ward record with a wardID
exports.findOne = (req, res) => {
  Ward_record.findByWardId(req.params.wardId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Ward record with wardId ${req.params.wardId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Ward record with wardId " + req.params.wardId
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
  
    Ward_record.updateById(
      req.params.wardId,
      new Patient(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Ward record with wardId ${req.params.wardId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Ward record with wardId " + req.params.wardId
            });
          }
        } else res.send(data);
      }
    );
  };

  exports.delete = (req, res) => {
    Ward_record.remove(req.params.wardId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Ward with id ${req.params.wardId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Ward record with id " + req.params.wardId
          });
        }
      } else res.send({ message: `Ward record was deleted successfully!` });
    });
  };

  exports.deleteAll = (req, res) => {
    Ward_record.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all Ward record."
        });
      else res.send({ message: `All Ward record were deleted successfully!` });
    });
  };