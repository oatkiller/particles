var canvas = document.createElement('canvas'),
	ctx = canvas.getContext('2d'),
	body = document.body,
	// the timeout reference for the main draw loop
	// should be set to undefined when inactive
	drawTimeout = undefined;

// setup styles on the body and html node. makes calculations and styling go easier	
[body.parentNode,body].forEach(function (element) {
	'width height'.split(' ').forEach(function (property) {
		this.style[property] = '100%';
	},element);
	'margin padding border'.split(' ').forEach(function (property) {
		this.style[property] = '0';
	},element);
	// prevents scrollbars
	element.style.overflow = 'hidden';
});

// add the canvas to the dom
body.appendChild(canvas);

// set the width and the height on the canvas
var updateCanvasDimensions = function () {
	// set the dimensions
	canvas.width = body.offsetWidth;
	canvas.height = body.offsetHeight;
	// this clears the ctx, so request a redraw
	requestRedraw();
};

// boolean, is the loop active
var isDrawLoopActive = function () {
	return drawTimeout !== undefined;
};

var startDrawLoop = function () {
	// draw, as fast as you can!
	drawTimeout = setTimeout(draw,0);
};

var stopDrawLoop = function () {
	clearTimeout(drawTimeout);
	// set it to undefined, so we know that its inactive
	drawTimeout = undefined;
};

// draw must call this at the end of its work
var continueDrawLoop = function () {
	isDrawLoopActive() && startDrawLoop();
};

// request a redraw, if the drawing loop is active, do nothing, a draw is pending anyway, otherwise, draw
var requestRedraw = function () {
	!isDrawLoopActive() && draw();
};

// just some state for testing
var count = 0;

// the main drawing thread
var draw = function () {
	document.title = count++;
	continueDrawLoop();
};

// register the updateCanvasDimensions fn to happen when the window is resize
window.addEventListener('resize',updateCanvasDimensions,false);

// go ahead and set the canvas dimensions now
updateCanvasDimensions();

// start the loop
startDrawLoop();

// stop it for now,
setTimeout(stopDrawLoop,10000);

