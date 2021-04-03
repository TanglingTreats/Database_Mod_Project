import * as Patient from './patient.js'
import * as Route from './routes.js'

$(document).ready(function() {

    var patientTag = document.getElementById('patientName');

    function getPatientName(data) {
        patientTag.textContent=data.name;
    }

    Patient.getAllPatients(Patient.getFirstPatient, getPatientName)
    Patient.getAllPatients(Patient.getFirstPatient, getDoctor)
    
    var userName = document.getElementById("username");
    function getDoctor(patientData) {
        var endpoint = Route.baseUrl + "/doctor/" + patientData.doctor_doctor_id
        $.ajax({
            type:'GET',
            url: endpoint,
            success: function(data) {
                userName.textContent = data.doctor_name
            },
            error: function(data) {
                Patient.getAllPatients(Patient.getFirstPatient, getPatientDoctor);
            }
        });
    }

    function getPatientDoctor(patientData) {
        userName.textContent = patientData.doctor.doctor_name;
    }
});