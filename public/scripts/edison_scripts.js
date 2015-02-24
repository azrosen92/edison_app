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

	var generate_cpu_stats = function(cpu_list) {
		for (var i = 0; i < cpu_list.length; i++) {
			var cpu_data = cpu_list[i];
			// Compute percentage of containing div each cpu will take up.
			var width = $('#about-cpus').width() / cpu_list.length;
			// Convert to string to use as css attribute.
			var width_pixels = width + "px";
			var css_props = {
				"float" : "left",
				"width" : width_pixels,
				"margin-top" : "80px"
			};
			var cpu_container = $('<div></div>').css(css_props);

			$('#about-cpus').append(cpu_container);

			// Create image tag for each cpu.
			var img_tag = $('<img>');
			img_tag.addClass('icon-image');
			img_tag.attr('src', '/images/cpu.png');

			cpu_container.append(img_tag);
			cpu_container.append($('<div>' + cpu_data['model'] + '</div>'));
		}	
	}

	var generate_network_connections = function(networks) {
		for (var network in networks) {

			// Compute width of individual network container.
			var width = $('#about-networks').width() / networks.length;
			var width_pixels = width + "px";

			var css_props = {
				"float" : "left",
				"width" : width_pixels,
				"margin-top" : "80px"
			};

			var network_container = $('<div></div>').css(css_props);

			$('#about-networks').append(network_container);

			// Create image tag for each network.
			var img_tag = $('<img>');
			img_tag.addClass('icon-image');
			img_tag.attr('src', '/images/network.png');

			network_container.append(img_tag);
			network_container.append($('<div>' + network + '</div>'));
		}
	}

	var request_success = function(data, textStatus, jqXHR) {
		console.log(data);

		$('body').append($('<div></div>').attr('id', 'about-device'));
		$('body').append($('<div></div>').attr('id', 'about-memory'));
		$('#about-memory').append($('<div></div>').attr('id', 'diskspace').addClass('half'));
		$('#about-memory').append($('<div></div>').attr('id', 'memory').addClass('half'));
		$('body').append($('<div></div>').attr('id', 'about-cpus'));
		$('body').append($('<div></div>').attr('id', 'about-networks'));

		// Add info about device.
		$('#about-device').append($('<h2>Device Info</h2>'));
		$('#about-device').append($('<div>' + data['os_type'] + ' ' + data['os_release'] + ' ' + data['os_cpu_arch'] + '</div>'));

		// Add info about memory usage.
		generate_pie_chart(data['diskspace'], 'Disk Space', '#diskspace');
		generate_pie_chart(data['memory'], 'Memory', '#memory');

		// Add info about CPUs
		generate_cpu_stats(data['cpu_stats']);

		// Add info about network connections.
		generate_network_connections(data['network_interfaces']);
	}

	$.ajax({
		url : 'http://localhost:3000/stats/api',
		dataType : 'json',
		success : request_success
	});
});