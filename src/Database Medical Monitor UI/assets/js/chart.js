$(document).ready(function() {
	
	// Bar Chart
	var barChartData = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
		datasets: [{
			label: 'Dataset 1',
			backgroundColor: 'rgba(0, 158, 251, 0.5)',
			borderColor: 'rgba(0, 158, 251, 1)',
			borderWidth: 1,
			data: [35, 59, 80, 81, 56, 55, 40]
		}]
	};

	var ctx = document.getElementById('bargraph').getContext('2d');
	window.myBar = new Chart(ctx, {
		type: 'bar',
		data: barChartData,
		options: {
			responsive: true,
			legend: {
				display: false,
			}
		}
	});

	// Line Chart

	var lineChartData = {
		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		datasets: [{
			label: "My First dataset",
			backgroundColor: "rgba(0, 158, 251, 0.5)",
			data: [100, 70, 20, 100, 120, 50, 70, 50, 50, 100, 50, 90]
		}]
	};
	
	var linectx = document.getElementById('linegraph').getContext('2d');
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
		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		datasets: [{
			label: "My First dataset",
			backgroundColor: "rgba(0, 158, 251, 0.5)",
			data: [100, 70, 20, 100, 120, 50, 70, 50, 50, 100, 50, 90]
		}]
	};
	
	var linectx = document.getElementById('linegraph').getContext('2d');
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