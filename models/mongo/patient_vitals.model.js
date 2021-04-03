const mongoClient = require("./db.mongo.js");
var patientVitalCollection = mongoClient.getDb().collection('patient_vital');

// constructor
const Patient_vitals = function (patient_vitals) {
  this.heart_rate = patient_vitals.heart_rate;
  this.bp_systolic = patient_vitals.systolic_bp;
  this.bp_diastolic = patient_vitals.diastolic_bp;
  this.temperature = patient_vitals.temperature
};


Patient_vitals.create = (newPatientVitalsRecord, result) => {
    sql.query("INSERT INTO patient_vitals SET ?", newPatientVitalsRecord, (err, res) => {
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
    const query = {patient_id: parseInt(p_id)};
    patientVitalCollection.find(query).toArray(function(err, results) {
      if (err) {result( err, null )};
      result(null, results);
      return;
    });
  };

  
  Patient_vitals.findByPvId = (pv_id, result) => {
    sql.query(`SELECT * FROM patient_vitals WHERE pv_id = ${pv_id}`, (err, res) => {
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
    sql.query("SELECT * FROM patient_vitals", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("patient vitals: ", res);
      result(null, res);
    });
  };

  Patient_vitals.updateById = (pv_id, patient_vitals, result) => {
    sql.query(
      "UPDATE patient_vitals SET heart_rate = ?, blood_pressure = ?, temperature = ? WHERE pv_id = ?",
      [patient_vitals.heart_rate, patient_vitals.blood_pressure, patient_vitals.temperature, pv_id],
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
  
        console.log("updated patient: ", { pv_id: pv_id, ...patient_vitals });
        result(null, { pv_id: pv_id, ...patient_vitals });
      }
    );
  };
  
  Patient_vitals.remove = (pv_id, result) => {
    sql.query("DELETE FROM patient_vitals WHERE pv_id = ?", pv_id, (err, res) => {
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
    sql.query("DELETE FROM patient_vitals", (err, res) => {
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