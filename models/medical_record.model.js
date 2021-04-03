const sql = require("./db.sql.js");

// constructor
const Medical_record = function (medical_record) {
  this.mr_date = medical_record.mr_date;
  this.appt_type = medical_record.appt_type;
  this.illness = medical_record.illness;
};


Medical_record.create = (newMedicalRecord, result) => {
    sql.query("INSERT INTO medical_record SET ?", newMedicalRecord, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created new medical record: ", { hos_id: res.insertId, ...newMedicalRecord });
      result(null, { mr_id: res.insertId, ...newMedicalRecord });
    });
  };

  
Medical_record.findByPatientId = (patientId, result) => {
    sql.query(`SELECT * FROM medical_record WHERE patient_patient_id = ${patientId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found medical record: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found medical record with the PatientId
      result({ kind: "not_found" }, null);
    });
  };


  Medical_record.getAll = result => {
    sql.query("SELECT * FROM medical_record", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("medical record: ", res);
      result(null, res);
    });
  };

  Medical_record.updateById = (patient_patient_id, medical_record, result) => {
    sql.query(
      "UPDATE medical_record SET mr_date = ?, appt_type = ?, illness = ? WHERE patient_patient_id = ?",
      [medical_record.mr_date, medical_record.appt_type, medical_record.illness, patient_patient_id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found medical record with the patient_patient_id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated medical record: ", { mr_id: mr_id, ...medical_record });
        result(null, { mr_id: mr_id, ...medical_record });
      }
    );
  };
  
  Medical_record.remove = (patient_patient_id, result) => {
    sql.query("DELETE FROM medical_record WHERE patient_patient_id = ?", patient_patient_id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found medical record with the patient_patient_id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted medical_record with id: ", patient_patient_id);
      result(null, res);
    });
  };
  
  Medical_record.removeAll = result => {
    sql.query("DELETE FROM medical_record", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} hospital`);
      result(null, res);
    });
  };
  
  module.exports = Medical_record;