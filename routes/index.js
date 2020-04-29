var express = require('express');
var router = express.Router();
const fs = require('fs');

var data = getData();

router.get('/', function (req, res) {
  	res.render('client', { 
    	title: 'Client'
	});
});

router.get('/open', function (req, res) {
  	res.render('open', { 
    	title: 'Open'
	});
});

router.get('/closed', function (req, res) {
	var data = getData();
	res.render('closed', {
		    title: 'Closed', 
		    reason: data.reason,
		    endtime: data.endtime,
    		timeleft: data.timeleft,
    		hasTime: data.hasTime
		});
});

router.post('/test', function (req, res) {
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.write(JSON.stringify(data));
	res.end();
});

router.get('/admin', function (req, res) {
	var data = getData();
	res.render('admin', {
		    title: 'Admin', 
		    reason: data.reason,
		    endtime: data.endtime,
    		timeleft: data.timeleft,
    		hasTime: "closed" == data.state
		});
});

router.post('/admin', function(req, res) {
	  Date.prototype.addDays = function(days) {
		    var date = new Date(this.valueOf());
		    date.setDate(date.getDate() + days);
		    return date;
		};

		var d = new Date();
		var month = d.getMonth() + 1;
		var day = d.getDate();
		var time = req.body.time;
		var action = req.body.action
		var countDownDate = new Date(month+" "+day+", "+ d.getFullYear()+" "+time);
		
		if(countDownDate < new Date() && req.body.time != ""){
			countDownDate = countDownDate.addDays(1);
		}

		fs.writeFileSync('./public/db.json', JSON.stringify(req.body));
		data = req.body;
		data.state = action;

	var now = new Date();
  	var distance = countDownDate - now;	
  	var timeString = getTimeString(distance);

	res.render('admin', {
		    title: 'Admin',
		    reason: req.body.reason,
		    endtime: time,
    		timeleft: timeString,
    		hasTime: true
	});
});

router.post('/delete', function (req, res) {
	data = get_def_data();
	write_db(data);
	res.sendStatus(200);
});

function write_db(data) {
	fs.writeFileSync('./public/db.json', JSON.stringify(data));
};

function getTimeString (distance) {
    // Time calculations for days, hours, minutes and seconds
	  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	  var makeTime = "";
	  if(days > 0){
	  	makeTime += days + "d ";
	  }
	  if(hours > 0){
	  	makeTime += hours + "h ";
	  }
	  if(minutes > 0){
	  	makeTime += minutes + "m ";
	  }
	  makeTime += seconds + "s ";
	  return makeTime;
};

function get_def_data() {
	return {
		state: "open",
		reason: "",
		endtime: null
	}
};

function getData (distance) {
	var data = get_def_data();
	try {
		fs.readFileSync('./public/db.json');
		data = JSON.parse();
	} catch (e) {
	}

	return data
};

module.exports = router;
