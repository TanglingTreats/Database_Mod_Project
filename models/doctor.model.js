const sql = require("./db.js");

// constructor
const Doctor = function (doctor) {
  this.doctor_name = doctor.doctor_name;
};


Doctor.create = (newDoctorDetail, result) => {
    sql.query("INSERT INTO doctor SET ?", newDoctorDetail, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created new doctor record: ", { doctor_id: res.insertId, ...newDoctorDetail });
      result(null, { doctor_id: res.insertId, ...newDoctorDetail });
    });
  };

  
  Doctor.findByDoctorId = (doctor_id, result) => {
    sql.query(`SELECT * FROM doctor WHERE doctor_id = ${doctor_id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found doctor: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found doctor with the id
      result({ kind: "not_found" }, null);
    });
  };


  Doctor.getAll = result => {
    sql.query("SELECT * FROM doctor", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("doctor: ", res);
      result(null, res);
    });
  };

  Doctor.updateById = (doctor_id, doctor, result) => {
    sql.query(
      "UPDATE doctor SET doctor_name = ? WHERE doctor_id = ?",
      [doctor.doctor_name, doctor_id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found doctor with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated doctor: ", { doctor_id: doctor_id, ...doctor });
        result(null, { doctor_id: doctor_id, ...doctor });
      }
    );
  };
  
  Doctor.remove = (doctor_id, result) => {
    sql.query("DELETE FROM doctor WHERE doctor_id = ?", doctor_id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found doctor with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted doctor with id: ", doctor_id);
      result(null, res);
    });
  };
  
  Doctor.removeAll = result => {
    sql.query("DELETE FROM doctor", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} doctor`);
      result(null, res);
    });
  };
  
  module.exports = Doctor;