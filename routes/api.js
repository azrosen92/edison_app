var express = require('express');
var router = express.Router();

var diskspace = require('diskspace');
var os = require('os');

/* GET index page of stats module. */
router.get('/', function(req, res, next) {
	res.render('stats', {title : 'Edison Stats'});
});

/* GET stats about device as json. */
router.get('/api', function(req, res, next) {
  diskspace.check('/', function(err, total, free, status) {
  	var stats = {
  		'os_type' : os.type(),
  		'os_platform' : os.platform(),
  		'os_cpu_arch' : os.arch(),
  		'os_release' : os.release(),
  		'diskspace' : {
  			'total' : total,
  			'free' : free
  		},
  		'memory' : {
	  		'total' : os.totalmem(),
	  		'free' : os.freemem()
	  	},
  		'cpu_stats' : os.cpus(),
  		'network_interfaces' : os.networkInterfaces()
  	};

  	res.json(stats);
  });
});

module.exports = router;