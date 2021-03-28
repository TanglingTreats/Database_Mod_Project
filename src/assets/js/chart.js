$(document).ready(function() {
	var baseUrl = "http://localhost:8000/api";

	function getPatientVital(patient) {
		console.log("second function");
		console.log(patient);
		console.log(patient.patient_vitals_pv_id);
		var endpoint = "/get_patient_vitals/"+patient.patient_id
		console.log("endpoint is: " + endpoint);

		$.ajax({
			type: 'GET',
			url: baseUrl + endpoint,
			success: function(data) {
				console.log(data);
				generateCharts(data);
			}
		});
	}

	function getFirstPatient(data) {
		var firstPatient = data[0];

		getPatientVital(firstPatient);
	}

	function getAllPatients(callback) {

		var endpoint = "/getAllPatients"
		$.ajax({
			type: 'GET',
			url:baseUrl + endpoint,
			success: function(data) {
				callback(data)
			},
		})
	}

	getAllPatients(getFirstPatient);

	function generateCharts(patientData) {

		var heartRateData = [];
		var systolicBp = [];
		var diastolicBp = [];
		var tempData = [];

		for(i of patientData) {
			heartRateData.push(i.heart_rate);
			systolicBp.push(i.bp_systolic);
			diastolicBp.push(i.bp_diastolic);
			tempData.push(i.temperature);
		}

		var bpData = {
			"systolicBp": systolicBp,
			"diastolicBp": diastolicBp
		};

		generateHeartRateChart(heartRateData);
		generateBloodPressureChart(bpData);
		generateTempChart(tempData);
	}

	function generateHeartRateChart(heartRateData) {
		var lineChartData = {
			labels: ["0000","0100","0200","0300","0400","0500","0600","0700","0800","0900","1000","1100","1200","1300",
			"1400","1500","1600","1700","1800","1900","2000","2100","2200","2300"],
			datasets: [{
				label: "Heart Rate",
				backgroundColor: "rgba(0, 158, 251, 0.5)",
				borderColor: 'rgba(0, 158, 251, 0.5)',
				data: heartRateData
			}]
		};
		var linectx = document.getElementById('Heart_Rate').getContext('2d');
		window.myLine = new Chart(linectx, {
			type: 'line',
			data: lineChartData,
			options: {
				responsive: true,
				legend: {
					display: false,
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				}
			}
		});
	}
	// Blood Pressure

	function generateBloodPressureChart(bpData) {
		var lineChartData = {
			labels: ["0000","0100","0200","0300","0400","0500","0600","0700","0800","0900","1000","1100","1200","1300",
			"1400","1500","1600","1700","1800","1900","2000","2100","2200","2300"],
			datasets: [{
				label: "Systolic Value",
				backgroundColor: "rgba(0, 158, 251, 0.5)",
				borderColor: 'rgba(0, 158, 251, 0.5)',
				data: bpData.systolicBp
			},
			{
				label: 'Diastolic Value',
				backgroundColor: 'rgba(255, 188, 53, 0.5)',
				borderColor: 'rgba(255, 188, 53, 1)',
				borderWidth: 1,
				data: bpData.diastolicBp
			}]
		};
		var linectx = document.getElementById('Blood_Pressure').getContext('2d');
		window.myLine = new Chart(linectx, {
			type: 'line',
			data: lineChartData,
			options: {
				responsive: true,
				legend: {
					display: false,
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				}
			}
		});
	}
	
	function generateTempChart(tempData) {
		// Temperature
		var lineChartData = {
			labels: ["0000","0100","0200","0300","0400","0500","0600","0700","0800","0900","1000","1100","1200","1300",
			"1400","1500","1600","1700","1800","1900","2000","2100","2200","2300"],
			datasets: [{
				label: "Temperature",
				backgroundColor: "rgba(0, 158, 251, 0.5)",
				data: tempData
			}]
		};
		
		var linectx = document.getElementById('Temperature').getContext('2d');
		window.myLine = new Chart(linectx, {
			type: 'line',
			data: lineChartData,
			options: {
				responsive: true,
				legend: {
					display: false,
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				}
			}
		});
	}
});