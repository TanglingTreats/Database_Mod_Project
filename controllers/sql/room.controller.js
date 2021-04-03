const Room = require("../../models/room.model.js");

// Create and Save a new room record
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a room record
    const room = new Room({
      room_no: req.body.room_no,
      ward: req.body.ward,

    });
  
    // Save Room into the database
    Room.create(room, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating new room record."
        });
      else res.send(data);
    });
  };

// Retrieve all Room record from the database.
exports.findAll = (req, res) => {
    Room.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving room records."
        });
      else res.send(data);
    });
  };

// Find a single room record with a roomId
exports.findOne = (req, res) => {
    Room.findByRoomId(req.params.roomId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Room record with roomId ${req.params.roomId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Room record with roomId " + req.params.roomId
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
  
    Room.updateById(
      req.params.roomId,
      new Patient(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Room record with roomId ${req.params.roomId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Room record with roomId " + req.params.roomId
            });
          }
        } else res.send(data);
      }
    );
  };

  exports.delete = (req, res) => {
    Room.remove(req.params.roomId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Room with id ${req.params.roomId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Room record with id " + req.params.roomId
          });
        }
      } else res.send({ message: `Room record was deleted successfully!` });
    });
  };

  exports.deleteAll = (req, res) => {
    Room.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all Room record."
        });
      else res.send({ message: `All Room record were deleted successfully!` });
    });
  };