var express = require('express');
var router = express.Router();
const fs = require('fs');

router.get('/', function (req, res) {
  	res.render('open', { 
    	title: 'Open'
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
  	 var data = getData();
  	 	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ 
        	reason: data.reason,  
        	endtime: data.endtime, 
        	timeleft: data.timeleft, 
        	hasTime: data.hasTime 
        }));
        res.end();
});

router.get('/admin', function (req, res) {
	var data = getData();
	res.render('admin', {
		    title: 'Admin', 
		    reason: data.reason,
		    endtime: data.endtime,
    		timeleft: data.timeleft,
    		hasTime: data.hasTime
		});
});

router.post('/admin', function(req, res) {
	  Date.prototype.addDays = function(days) {
		    var date = new Date(this.valueOf());
		    date.setDate(date.getDate() + days);
		    return date;
		}

		var d = new Date();
		var month = d.getMonth() + 1;
		var day = d.getDate();
		var time = req.body.time;
		var countDownDate = new Date(month+" "+day+", "+ d.getFullYear()+" "+time);
		
		if(countDownDate < new Date() && req.body.time != ""){
			countDownDate = countDownDate.addDays(1);
		}

	fs.writeFile('./public/db.txt', req.body.reason+"\n"+countDownDate+"\n"+time, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    else{
	    	console.log("The file was saved!");
	    }
	});

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
	fs.writeFile('./public/db.txt', '', function(){
		res.sendStatus(200);
	});
});

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

function getData (distance) {
    var lines = fs.readFileSync('./public/db.txt', 'utf-8').split(/\r?\n/);
	var time = lines[1];
	var now = new Date();
  	var distance = Date.parse(lines[1]) - now;
  	var timeString = getTimeString(distance);
  	var hasTime = true;
  	if (distance < 0 || typeof time == 'undefined') {
  	 	hasTime = false;
  	}

	return {reason: lines[0],
	    	endtime: lines[2],
			timeleft: timeString,
			hasTime: hasTime};
};

module.exports = router;
