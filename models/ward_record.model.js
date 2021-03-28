const sql = require("./db.js");

// constructor
const Ward_record = function (ward_record) {
  this.start_date = ward_record.start_date;
  this.end_date = ward_record.end_date
  this.duration = ward_record.duration
};


Ward_record.create = (newWardRecord, result) => {
    sql.query("INSERT INTO ward_record SET ?", newWardRecord, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created new ward record: ", { wr_id: res.insertId, ...newWardRecord });
      result(null, { wr_id: res.insertId, ...newWardRecord });
    });
  };

  
  Ward_record.findByWardId = (wr_id, result) => {
    sql.query(`SELECT * FROM ward_record WHERE wr_id = ${wr_id}`, (err, res) => {
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
  
      // not found ward with the id
      result({ kind: "not_found" }, null);
    });
  };


  Ward_record.getAll = result => {
    sql.query("SELECT * FROM ward_record", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("room: ", res);
      result(null, res);
    });
  };

  Ward_record.updateById = (wr_id, ward_record, result) => {
    sql.query(
      "UPDATE ward_record SET  start_date = ?, end_date = ?, duration = ? WHERE wr_id = ?",
      [ward_record.start_date, ward_record.end_date, ward_record.duration, wr_id],
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
  
        console.log("updated ward record: ", { wr_id: wr_id, ...ward_record });
        result(null, { wr_id: wr_id, ...ward_record });
      }
    );
  };
  
  Ward_record.remove = (wr_id, result) => {
    sql.query("DELETE FROM ward_record WHERE wr_id = ?", wr_id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Ward with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted ward with id: ", wr_id);
      result(null, res);
    });
  };
  
  Ward_record.removeAll = result => {
    sql.query("DELETE FROM ward_record", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} ward`);
      result(null, res);
    });
  };
  
  module.exports = Ward_record;