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

	// Blood Pressure
	var lineChartData = {
		labels: ["0000","0100","0200","0300","0400","0500","0600","0700","0800","0900","1000","1100","1200","1300",
		"1400","1500","1600","1700","1800","1900","2000","2100","2200","2300"],
		datasets: [{
			label: "Heart Rate",
			backgroundColor: "rgba(0, 158, 251, 0.5)",
			borderColor: 'rgba(0, 158, 251, 0.5)',
			data: [90,75,83,99,101,120,121,131,135,107,65,72,87,98,105,113,117,127,138,77,91,100,68,108]
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

	var lineChartData = {
		labels: ["0000","0100","0200","0300","0400","0500","0600","0700","0800","0900","1000","1100","1200","1300",
		"1400","1500","1600","1700","1800","1900","2000","2100","2200","2300"],
		datasets: [{
			label: "Systolic Value",
			backgroundColor: "rgba(0, 158, 251, 0.5)",
			borderColor: 'rgba(0, 158, 251, 0.5)',
			data: [90,75,83,99,101,120,121,131,135,107,65,72,87,98,105,113,117,127,138,77,91,100,68,108]
		},
		{
			label: 'Distolic Value',
			backgroundColor: 'rgba(255, 188, 53, 0.5)',
			borderColor: 'rgba(255, 188, 53, 1)',
			borderWidth: 1,
			data: [35,37,36,29,43,35,49,54,57,60,61,63,67,71,72,45,79,80,82,26,85,89,20,55,25,27]
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
	
	// Temperature
	var lineChartData = {
		labels: ["0000","0100","0200","0300","0400","0500","0600","0700","0800","0900","1000","1100","1200","1300",
		"1400","1500","1600","1700","1800","1900","2000","2100","2200","2300"],
		datasets: [{
			label: "Temperature",
			backgroundColor: "rgba(0, 158, 251, 0.5)",
			data: [36.1,35.3,35.4,35.5,36.9,36.0,36.1,36.2,36.3,36.4,36.4,36.7,36.4,36.5,36.5,37.1,37.5,36.4,36.7,36.8,36.1,36.8,37.8,37.0]
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
});