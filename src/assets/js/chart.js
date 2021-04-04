import * as Patient from './patient.js'
import * as Route from './routes.js'

$(document).ready(function() {
	// var baseUrl = "http://localhost:8000/api";

	var currentDate = document.getElementById("currentDate");

	function getPatientVital(patient) {
		var endpoint = "/get_patient_vitals/"+patient.patient_id;

		$.ajax({
			type: 'GET',
			url: Route.baseUrl + endpoint,
			success: function(data) {
				generateCharts(data.slice(Math.max(data.length-24, 0)));
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
			},
			error: function(data) {
				ward.textContent = patientData.ward_info.ward;
				room.textContent = patientData.ward_info.room;
				bed.textContent = patientData.ward_info.bed;
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
		conditions.textContent = patientData.symptoms;
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

		console.log(patientData);
		var timeData = [];
		var heartRateData = [];
		var systolicBp = [];
		var diastolicBp = [];
		var tempData = [];

		for(var i of patientData) {
			heartRateData.push(i.heart_rate);
			systolicBp.push(i.bp_systolic);
			diastolicBp.push(i.bp_diastolic);
			tempData.push(i.temperature);
			
			var date = new Date(i.vital_datetime)
			console.log(date);
			var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
			hours = hours < 10 ? "0" + hours : hours;
			var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
			var time = `${hours}${minutes}`
			timeData.push(time)
		}

		var bpData = {
			"systolicBp": systolicBp,
			"diastolicBp": diastolicBp
		};

		generateHeartRateChart(heartRateData, timeData);
		generateBloodPressureChart(bpData, timeData);
		generateTempChart(tempData, timeData);
	}

	function generateHeartRateChart(heartRateData, timeData) {
		console.log(timeData);
		var lineChartData = {
			labels: timeData,
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

	function generateBloodPressureChart(bpData, timeData) {
		var lineChartData = {
			labels: timeData,
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
	
	function generateTempChart(tempData, timeData) {
		// Temperature
		var lineChartData = {
			labels: timeData,
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