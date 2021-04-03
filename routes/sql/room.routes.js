module.exports = app => {
    const room = require("../../controllers/sql/room.controller.js");

    // Create a new room record
    app.post("/api/room", room.create);
  
    // Retrieve all room record
    app.get("/api/room", room.findAll);
  
    // Retrieve a single room with roomId
    app.get("/api/room/:roomId", room.findOne);

    // Update room with roomId
    app.put("/api/room/:roomId", room.update);

    // Delete room record with roomId
    app.delete("/api/room/:roomId", room.delete);
  
    // Delete all room record
    app.delete("/api/room", room.deleteAll);
  };