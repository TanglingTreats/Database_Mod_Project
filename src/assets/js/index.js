import * as Patient from './patient.js'

$(document).ready(function() {

    var patientTag = document.getElementById('patientName');

    function getPatientName(data) {
        patientTag.textContent=data.name;
    }

    Patient.getAllPatients(Patient.getFirstPatient, getPatientName)
});