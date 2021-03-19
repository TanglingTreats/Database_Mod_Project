const sql = require("./db.js");

// constructor
const Patient = function (patient) {
  this.name = patient.name;
  this.age = patient.age;
  this.gender = patient.gender
};


Patient.create = (newPatientRecord, result) => {
    sql.query("INSERT INTO patient SET ?", newPatientRecord, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created new hospital record: ", { patient_id: res.insertId, ...newHospitalRecord });
      result(null, { patient_id: res.insertId, ...newHospitalRecord });
    });
  };

  
  Patient.findByPatientId = (patientId, result) => {
    sql.query(`SELECT * FROM patient WHERE patient_id = ${patientId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found patient: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found hospital with the id
      result({ kind: "not_found" }, null);
    });
  };


  Patient.getAll = result => {
    sql.query("SELECT * FROM patient", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("patient: ", res);
      result(null, res);
    });
  };

  Patient.updateById = (patient_id, patient, result) => {
    sql.query(
      "UPDATE patient SET name = ?, age = ?, gender = ? WHERE patient_id = ?",
      [patient.name, patient.age, patient.gender, patient_id],
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
  
        console.log("updated patient: ", { patient_id: patient_id, ...patient });
        result(null, { patient_id: patient_id, ...patient });
      }
    );
  };
  
  Patient.remove = (patient_id, result) => {
    sql.query("DELETE FROM patient WHERE patient_id = ?", patient_id, (err, res) => {
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
  
      console.log("deleted patient_id with id: ", patient_id);
      result(null, res);
    });
  };
  
  Patient.removeAll = result => {
    sql.query("DELETE FROM patient", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} patient`);
      result(null, res);
    });
  };
  
  module.exports = Patient;