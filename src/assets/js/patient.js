var baseUrl = "http://localhost:8000/api";

export function getFirstPatient(data, callback) {
    var firstPatient = data[0];

    callback(firstPatient);
}

export function getAllPatients(callback, taskCallback) {

    var endpoint = "/getAllPatients"
    $.ajax({
        type: 'GET',
        url:baseUrl + endpoint,
        success: function(data) {
            // console.log(data);
            callback(data, taskCallback)
        },
    })
}

// export var getFirstPatientData = Promise.resolve(getAllPatients(getFirstPatient));