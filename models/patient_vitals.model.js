const sql = require("./db.sql.js");

// constructor
const Patient_vitals = function (patient_vital) {
  this.heart_rate = patient_vital.heart_rate;
  this.bp_systolic = patient_vital.systolic_bp;
  this.bp_diastolic = patient_vital.diastolic_bp;
  this.temperature = patient_vital.temperature
};


Patient_vitals.create = (newPatientVitalsRecord, result) => {
    sql.query("INSERT INTO patient_vital SET ?", newPatientVitalsRecord, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created new patient vitals record: ", { pv_id: res.insertId, ...newPatientVitalsRecord });
      result(null, { pv_id: res.insertId, ...newPatientVitalsRecord });
    });
  };

  Patient_vitals.findByPId = (p_id, result) => {
    sql.query(`SELECT * FROM patient_vital WHERE patient_patient_id = ${p_id} ORDER BY vital_datetime ASC`,(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found patient vital: ", res);
        result(null, res);
        return;
      }
    });
  };

  
  Patient_vitals.findByPvId = (pv_id, result) => {
    sql.query(`SELECT * FROM patient_vital WHERE pv_id = ${pv_id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found patient vital: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found hospital with the id
      result({ kind: "not_found" }, null);
    });
  };


  Patient_vitals.getAll = result => {
    sql.query("SELECT * FROM patient_vital", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("patient vitals: ", res);
      result(null, res);
    });
  };

  Patient_vitals.updateById = (pv_id, patient_vital, result) => {
    sql.query(
      "UPDATE patient_vital SET heart_rate = ?, blood_pressure = ?, temperature = ? WHERE pv_id = ?",
      [patient_vital.heart_rate, patient_vital.blood_pressure, patient_vital.temperature, pv_id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found patient vitals with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated patient: ", { pv_id: pv_id, ...patient_vital });
        result(null, { pv_id: pv_id, ...patient_vital });
      }
    );
  };
  
  Patient_vitals.remove = (pv_id, result) => {
    sql.query("DELETE FROM patient_vital WHERE pv_id = ?", pv_id, (err, res) => {
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
  
      console.log("deleted patient vitals with id: ", pv_id);
      result(null, res);
    });
  };
  
  Patient_vitals.removeAll = result => {
    sql.query("DELETE FROM patient_vital", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} patient vitals`);
      result(null, res);
    });
  };
  
  module.exports = Patient_vitals;