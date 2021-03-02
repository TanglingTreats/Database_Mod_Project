const sql = require("./db.js");

// constructor
const Hospital = function (hospital) {
  this.name = hospital.name;
  this.location = hospital.location;
};


Hospital.create = (newHospitalRecord, result) => {
    sql.query("INSERT INTO hospital SET ?", newHospitalRecord, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created new hospital record: ", { id: res.insertId, ...newHospitalRecord });
      result(null, { id: res.insertId, ...newHospitalRecord });
    });
  };

  
Hospital.findByHospitalId = (hospitalId, result) => {
    sql.query(`SELECT * FROM hospital WHERE id = ${hospitalId}`, (err, res) => {
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

  module.exports = Hospital;