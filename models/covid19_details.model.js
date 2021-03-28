const sql = require("./db.js");

// constructor
const Covid19_details = function (covid19_details) {
  this.is_positive = covid19_details.is_positive;
  this.infected_date = covid19_details.infected_date;
  this.last_tested = covid19_details.last_tested;
  this.injection_date = covid19_details.injection_date;
  this.condition_status = covid19_details.condition_status
};


Covid19_details.create = (newCovid19Details, result) => {
    sql.query("INSERT INTO covid19_details SET ?", newCovid19Details, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created new Covid19 details: ", { covid_id: res.insertId, ...newCovid19Details });
      result(null, { covid_id: res.insertId, ...newCovid19Details });
    });
  };

  
  Covid19_details.findByCovidId = (covid_id, result) => {
    sql.query(`SELECT * FROM covid19_details WHERE covid_id = ${covid_id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found Covid19 details: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Covid19 details with the id
      result({ kind: "not_found" }, null);
    });
  };


  Covid19_details.getAll = result => {
    sql.query("SELECT * FROM covid19_details", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("covid19 details: ", res);
      result(null, res);
    });
  };

  Covid19_details.updateById = (covid_id, covid19_details, result) => {
    sql.query(
      "UPDATE covid19_details SET is_positive = ?, infected_date = ?, last_tested = ?, injection_date = ?, condition_status = ? WHERE covid_id = ?",
      [covid19_details.is_positive, covid19_details.infected_date, covid19_details.last_tested, covid19_details.injection_date, covid19_details.condition_status, covid_id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found covid19 details with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated covid19 details: ", { covid_id: covid_id, ...covid19_details });
        result(null, { covid_id: covid_id, ...covid19_details });
      }
    );
  };
  
  Covid19_details.remove = (covid_id, result) => {
    sql.query("DELETE FROM covid19_details WHERE covid_id = ?", covid_id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found covid19 details with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted covid19 details with id: ", covid_id);
      result(null, res);
    });
  };
  
  Covid19_details.removeAll = result => {
    sql.query("DELETE FROM covid19_details", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} covid19 details`);
      result(null, res);
    });
  };
  
  module.exports = Covid19_details;