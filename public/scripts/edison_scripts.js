$(function() {
	console.log('scripts loaded!');

	var generate_pie_chart = function(data, title, bindto) {
		var total = data['total'];
		var free = data['free'];
		var used = total - free;

		var free_gb = free / (1024 * 1024 * 1024);
		var used_gb = used / (1024 * 1024 * 1024);
		var total_gb = total / (1024 * 1024 * 1024);

		var chart = c3.generate({
			data: {
				columns: [
					['Free (GB)', free_gb],
					['Used (GB)', used_gb]
				],
				type: 'donut'
			},
			donut : {
				title : title
			},
			bindto : bindto
		});
	}

	var request_success = function(data, textStatus, jqXHR) {
		console.log(data);

		var div = $('<div></div>');
		$('body').append($('<div></div>').attr('id', 'diskspace'));
		$('body').append($('<div></div>').attr('id', 'memory'));

		generate_pie_chart(data['diskspace'], 'Disk Space', '#diskspace');
		generate_pie_chart(data['memory'], 'Memory', '#memory');
	};

	$.ajax({
		url : 'http://localhost:3000/stats/api',
		dataType : 'json',
		success : request_success
	});
});