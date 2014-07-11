hotjs = hotjs || {};
hotjs.motion = hotjs.motion || {};

(function(){
// The watch id references the current `watchAcceleration`
var watchID = null;

var accels = [];
var minX = 0, maxX = 0;
var minY = 0, maxY = 0;
var minZ = 0, maxZ = 0;

var motions = [];
var maxMotion = 200, minMotion = 0;

var lastTime = 0;
var motionCount = 0;
var motionTime = 0;

var pausecount = false;

var motionHistory = 60;
var countCallback = function(n) {}

var motionSensor = 0.4;
function setMotionSensity( s ) {
	motionSensor = Math.max(0.2, Math.min(0.8, s));
}

function getCount() {
	return motionCount;
}
function resetCount() {
	lastTime = 0;
	motionCount = 0;
	motionTime = 0;
}
function pauseCount(p) {
	pausecount = (!! p);
}
function isPaused(){
	return (!! pausecount);
}
function tickCount() {
	if(pausecount) return;
	
	var now = (new Date()).getTime();
	
	// we only accumulate motion time
	if(! lastTime) lastTime = now;
	var delta = now - lastTime;
	if(delta < 2000) {
		motionTime += delta;
	}
	
	motionCount ++;
	lastTime = now;
	
    if(countCallback) countCallback( motionCount );
}

function getTime() {
	return motionTime;
}
function getDurationSeconds() {
	return Math.round( motionTime / 1000);
}

function setCountCallback(func) {
	if(func) countCallback = func;
}
function computeMotion(accel) {
	// record acceleration for drawing 
	if((maxX == 0) || (accel.x > maxX)) maxX = accel.x;
	if((minX == 0) || (accel.x < minX)) minX = accel.x;
	
	if((maxY == 0) || (accel.y > maxY)) maxY = accel.y;
	if((minY == 0) || (accel.y < minY)) minY = accel.y;
	
	if((maxZ == 0) || (accel.z > maxZ)) maxZ = accel.z;
	if((minZ == 0) || (accel.z < minZ)) minZ = accel.z;
	
	accels.push( accel );
	if(accels.length > motionHistory) accels.shift();
	
	// record motion for drawing
	var motion = (accel.x * accel.x + accel.y * accel.y + accel.z * accel.z);
	
	if((maxMotion == 0) || (motion > maxMotion)) maxMotion = motion;
	if((minMotion == 0) || (motion < minMotion)) minMotion = motion;
	
	// detect action
	if(motions.length > 0) {
		var detectLine = minMotion + (maxMotion - minMotion) * motionSensor;
		var lastMotion = motions[ motions.length - 1 ];
		if(motion > detectLine && lastMotion < detectLine) {
			tickCount();
        }
	}

	motions.push( motion );
	if(motions.length > motionHistory) motions.shift();
}

var motionCanvas = null;
function setMotionCanvas( canvas, w, h ) {
	motionCanvas = {
		id : canvas,
		w : w,
		h : h
	};
}
 function drawGrid( c, bgcolor, color, col, row ) {
	 
 var w = c.width, h = c.height;
 var ctx = c.getContext("2d");
 ctx.save();
 //ctx.clearRect(0,0, w, h);
 ctx.fillStyle = bgcolor; //'#dddddd';
 ctx.fillRect(0,0, w,h);
 
 ctx.strokeStyle = color;
 var cx = w / col;
 var cy = h / row;
 ctx.beginPath();
 for(var x=0; x<=w; x+=cx) {
 ctx.moveTo(x, 0);
 ctx.lineTo(x, h);
 }
 for(var y=0; y<=h; y+=cy) {
 ctx.moveTo(0, y);
 ctx.lineTo(w, y);
 }
 ctx.stroke();
 ctx.strokeRect(0,0,w,h);
 ctx.restore();
 }

 function drawMotionCurve() {
	if(! motionCanvas) return;
	
	var c = document.getElementById( motionCanvas.id );
	if(! c) return;
	
	var w = c.width, h = c.height;
	var scale = w / motionHistory;
	
	var ctx = c.getContext("2d");
 
    drawGrid(c, 'black', 'gray', 30, 5);
	
    ctx.save();
	ctx.strokeStyle = "yellow";
	ctx.lineWidth = 2;
	ctx.beginPath();
	for(var i=0; i<motions.length; i++) {
		var x = i * scale;
		var y = h - h * motions[i] / maxMotion;
		if(i == 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		} 		
	}
	ctx.stroke();
	ctx.restore();
}

var xyzCanvas = null;
function setXYZCanvas( canvas, w, h ) {
	xyzCanvas = {
			id : canvas,
			w : w,
			h : h
		};
}
function drawXYZCurve() {
	if(! xyzCanvas) return;
	
	var canvas = document.getElementById( xyzCanvas.id );
	if(! canvas) return;
	
	var w = canvas.width, h = canvas.height;
	var h6 = h / 6.0;
	var scale = w / motionHistory;

	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0, w, h);
	
	ctx.strokeStyle = 'gray';
	ctx.beginPath();
	ctx.moveTo(0, h6); ctx.moveTo(w, h6 );
	ctx.moveTo(0, h6 *3); ctx.moveTo(w, h6 *3 );
	ctx.moveTo(0, h6 *5); ctx.moveTo(w, h6 *5 );
	ctx.stroke();
	
	ctx.strokeStyle = "red";
	ctx.beginPath();
	for(var i=0; i<accels.length; i++) {
		var x = i * scale;
		var y = h6 * (1 + accels[i].x/maxX);
		if(i == 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		} 		
	}
	ctx.stroke();

	ctx.strokeStyle = "green";
	ctx.beginPath();
	for(var i=0; i<accels.length; i++) {
		var x = i * scale;
		var y = h6 * (3 + accels[i].y/maxY);
		if(i == 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		} 		
	}
	ctx.stroke();
	
	ctx.strokeStyle = "blue";
	ctx.beginPath();
	for(var i=0; i<accels.length; i++) {
		var x = i * scale;
		var y = h6 * (5 + accels[i].z/maxZ);
		if(i == 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		} 		
	}
	ctx.stroke();
}

var requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame || window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame || function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
})();

var drawing = false;
function drawCurve() {
	if(! drawing) return;
	
	drawMotionCurve();
	drawXYZCurve();
	
	requestAnimFrame( drawCurve );
}

var motionSuccessCallback = function(){};
var motionErrorCallback = function() {};

function setMotionCallback( okFunc, errFunc ) {
	motionSuccessCallback = okFunc;
	motionErrorCallback = errFunc;
}

function initMotion() {
	if(! navigator.accelerometer) {
		console.log('device-motion simulation.')
		var onOkFunc = null;
		var onErrFunc = null;
		function motionSimutator(){
			if(onOkFunc) {
				var t = (new Date()).getTime();
				onOkFunc({
					x: 10 * Math.sin(t/6.0 * 3.1416926/180),
					y: 5 * Math.cos(t/6.0 * 3.1416926/180),
					z: 0,
					timestamp: t
				});
			}
		}
		navigator.accelerometer = {
				watchAcceleration : function(okFunc,errFunc,opt) { 
					onOkFunc = okFunc;
					onErrFunc = errFunc;
					var freq = (opt && opt.frequency) ? opt.frequency : 100;
					var watchId = window.setInterval(motionSimutator, freq);
					return watchId; 
				},
				clearWatch : function(watchID) {
					clearInterval(watchID);
				}
		};
	}
}

// Start watching the acceleration
function startWatch( freq ) {
	if(! freq) freq = 100;
	
	pausecount = false;
	resetCount();
	
    // Update acceleration frequency
    var options = { frequency: freq };
    watchID = navigator.accelerometer.watchAcceleration(function( accel ){
    	//onSuccess: Get a snapshot of the current acceleration
    	computeMotion( accel );
    	if(motionSuccessCallback) motionSuccessCallback( accel );
    }, function(){
    	// onError: Failed to get the acceleration
    	if(motionErrorCallback) motionErrorCallback();
    }, options);
    
	drawing = true;
	drawCurve();
}

// Stop watching the acceleration
function stopWatch() {
    if (watchID) {
        navigator.accelerometer.clearWatch(watchID);
        watchID = null;
    }
    
	drawing = false;
}

function isWatching() {
	return (watchID != null);
}

hotjs.motion = {
	init : initMotion,
	setMotionSensity : setMotionSensity,
	setMotionCanvas : setMotionCanvas,
	setXYZCanvas : setXYZCanvas,
	setMotionCallback : setMotionCallback,
	setCountCallback : setCountCallback,
	
	startWatch : startWatch,
	stopWatch : stopWatch,
	isWatching : isWatching,
	
	pauseCount : pauseCount,
	
	isPaused : isPaused,
	getCount : getCount,
	getTime : getTime,
	getDurationSeconds : getDurationSeconds
};

})();
