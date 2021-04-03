const sql = require("./db.sql.js");

// constructor
const Hospital = function (hospital) {
  this.hos_name = hospital.hos_name;
  this.hos_location = hospital.hos_location;
};


Hospital.create = (newHospitalRecord, result) => {
    sql.query("INSERT INTO hospital SET ?", newHospitalRecord, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created new hospital record: ", { hos_id: res.insertId, ...newHospitalRecord });
      result(null, { hos_id: res.insertId, ...newHospitalRecord });
    });
  };

  
Hospital.findByHospitalId = (hospitalId, result) => {
    sql.query(`SELECT * FROM hospital WHERE hos_id = ${hospitalId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found hospital: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found hospital with the id
      result({ kind: "not_found" }, null);
    });
  };


  Hospital.getAll = result => {
    sql.query("SELECT * FROM hospital", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("hospital: ", res);
      result(null, res);
    });
  };

  Hospital.updateById = (hos_id, hospital, result) => {
    sql.query(
      "UPDATE hospital SET hos_name = ?, hos_location = ? WHERE hos_id = ?",
      [hospital.hos_name, hospital.hos_location, hos_id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found hospital with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated hospital: ", { hos_id: hos_id, ...hospital });
        result(null, { hos_id: hos_id, ...hospital });
      }
    );
  };
  
  Hospital.remove = (hos_id, result) => {
    sql.query("DELETE FROM hospital WHERE hos_id = ?", hos_id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found hospital with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted hospital with id: ", hos_id);
      result(null, res);
    });
  };
  
  Hospital.removeAll = result => {
    sql.query("DELETE FROM hospital", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} hospital`);
      result(null, res);
    });
  };
  
  module.exports = Hospital;