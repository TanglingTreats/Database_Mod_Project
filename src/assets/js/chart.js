import * as Patient from './patient.js'
import * as Route from './routes.js'

$(document).ready(function() {
	// var baseUrl = "http://localhost:8000/api";

	var currentDate = document.getElementById("currentDate");

	function getPatientVital(patient) {
		console.log(patient);
		var endpoint = "/get_patient_vitals/"+patient.patient_id;

		$.ajax({
			type: 'GET',
			url: Route.baseUrl + endpoint,
			success: function(data) {
				console.log(data);
				generateCharts(data);
				var lastData = data.pop();
				generateCardData(lastData);
				getCovidDetails(lastData)
				currentDate.innerText = new Date().toDateString();
			}
		});
	}
	
	function getCovidDetails(pV) {
		var endpoint = "/covid19_details/"+pV.covid19_details_covid_id;
		$.ajax({
			type: 'GET',
			url: Route.baseUrl + endpoint,
			success: function(data) {
				console.log(data);
				generateCovidDetails(data);
			}
		});
	}
	
	var ward = document.getElementById("wardNumber");
	var room = document.getElementById("roomNumber");
	var bed = document.getElementById("bedNumber");
	function getRoomDetails(patientData) {
		var endpoint = "/room/" + patientData.room_id;
		
		$.ajax({
			type: 'GET',
			url: Route.baseUrl + endpoint,
			success: function(data) {
				console.log(data);
				ward.textContent = data.ward_no;
				room.textContent = data.room_no;
				bed.textContent = data.bed_no;
			}
		})
	}

	Patient.getAllPatients(Patient.getFirstPatient, getPatientVital);

	Patient.getAllPatients(Patient.getFirstPatient, getRoomDetails);


	var covidResult = document.getElementById("covidResult");
	var infectedDate = document.getElementById("infectedDate");
	var lastTested = document.getElementById("lastTested");
	var vaccDate = document.getElementById("vaccinationDate");
	var conditions = document.getElementById("conditions");
	
	var testResults = ["Negative", "Positive"]
	function generateCovidDetails(patientData) {
		covidResult.textContent = testResults[patientData.is_positive];
		infectedDate.textContent = new Date(patientData.infected_date).toDateString();
		lastTested.textContent = new Date(patientData.last_tested).toDateString();
		vaccDate.textContent = new Date(patientData.injection_date).toDateString();
		conditions.textContent = patientData.conditions;
	}

	var patientHR = document.getElementById('cardHeartRate');
	var patientBP = document.getElementById('cardBloodPressure');
	var patientTemp = document.getElementById('cardTemperature');

	function generateCardData(patientData) {

		patientHR.textContent = patientData.heart_rate;

		patientBP.textContent = `${patientData.bp_systolic}/${patientData.bp_diastolic}`;
		
		patientTemp.textContent = `${patientData.temperature}°C`
	}

	function generateCharts(patientData) {

		var heartRateData = [];
		var systolicBp = [];
		var diastolicBp = [];
		var tempData = [];

		for(var i of patientData) {
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