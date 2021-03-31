const sql = require("./db.js");

// constructor
const Room = function (room) {
  this.room_no = patient.room_no;
  this.ward = patient.ward;
};

Room.create = (newRoomRecord, result) => {
  sql.query("INSERT INTO room SET ?", newRoomRecord, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created new room record: ", {
      room_id: res.insertId,
      ...newRoomRecord,
    });
    result(null, { room_id: res.insertId, ...newRoomRecord });
  });
};

Room.findByRoomId = (room_id, result) => {
  sql.query(`SELECT * FROM room WHERE room_id = ${room_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found room: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found room with the id
    result({ kind: "not_found" }, null);
  });
};

Room.getAll = (result) => {
  sql.query("SELECT * FROM room", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("room: ", res);
    result(null, res);
  });
};

Room.updateById = (room_id, room, result) => {
  sql.query(
    "UPDATE room SET room_no = ?, ward = ? WHERE room_id = ?",
    [room.room_no, room.ward, room_id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found patient with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated room: ", { room_id: room_id, ...room });
      result(null, { room_id: room_id, ...room });
    }
  );
};

Room.remove = (room_id, result) => {
  sql.query("DELETE FROM room WHERE room_id = ?", room_id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found room with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted room with id: ", room_id);
    result(null, res);
  });
};

Room.removeAll = (result) => {
  sql.query("DELETE FROM room", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} room`);
    result(null, res);
  });
};

module.exports = Room;
