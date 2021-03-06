/* config takes,
stopped : defaults to false, if true, wont start drawing automatically
onDraw : required, the method is passed a ctx, over and over again. draw cool stuff to it
*/

var FullBrowserCanvasAnimation = function (config) {
	// copy all config stuff over
	if (config) {
		for (var propertyName in config) {
			this[propertyName] = config[propertyName];
		}
	}

	// init this
	this.mouseMoves = [];

	// get a personal version of these, since we need to use them without context
	'draw updateCanvasDimensions updateMouseCoordinates setMouseDown setMouseUp'.split(' ').forEach(function (property) {
		this[property] = this[property].bind(this);
	},this);

	// this has to come first
	this.initializeCanvas();

	// incase the implementer wants to do anything
	this.onInit();

	// because this calls the canvas
	this.initializeBody();

	// start the loop unless stopped was passed
	!this.stopped && this.startDrawLoop();
};

FullBrowserCanvasAnimation.prototype = {

	// gives the implementers a chance to wreck havoc
	onInit : function () {
	},

	// when the canvas gets resized / reset
	// note that ondraw gets called as well
	onResize : function () {
	},

	// default stuff to draw. nothing
	onDraw : function () {
	},

	// stopped by default?
	stopped : false,

	// an array
	// holds all mousemove data. 
	// each element has x, y, time, and button
	// this is refreshed at each draw
	mouseMoves : null,

	// whether or not the mouse is depressed
	// this is recorded into each mouse move
	mousedown : false,

	// current mouse move
	// current mouse x coord
	// an object with x, y, and mousedown (boolean)
	currentMouseMove : null,

	// the timeout reference for the main draw loop
	// should be set to undefined when inactive
	drawTimeout : undefined,

	// the body, this can only run in a browser, so!
	body : document.body,

	// this will be the canvas element
	canvas : null,

	// this will be the canvas 2d context
	ctx : null,

	// the last time a draw occured
	// used in fps calculation
	lastDrawTime : null,

	// get this to determine how much to move stuff, usually
	getLastDrawTime : function () {
		return this.lastDrawTime;
	},

	getTimeSinceLastDraw : function () {
		return new Date().getTime() - this.lastDrawTime;
	},

	getSecondsSinceLastDraw : function () {
		return this.getTimeSinceLastDraw() / 1000;
	},

	// setup styles on the body and html node. makes calculations and styling go easier	
	initializeBody : function () {
		[this.body.parentNode,this.body].forEach(function (element) {
			'width height'.split(' ').forEach(function (property) {
				this.style[property] = '100%';
			},element);
			'margin padding border'.split(' ').forEach(function (property) {
				this.style[property] = '0';
			},element);
			// prevents scrollbars
			element.style.overflow = 'hidden';
		});

		// register the updateCanvasDimensions fn to happen when the window is resize
		window.addEventListener('resize',this.updateCanvasDimensions,false);

		// update the latest mouse coordinates
		window.addEventListener('mousemove',this.updateMouseCoordinates,false);

		window.addEventListener('mousedown',this.setMouseDown,false);
		window.addEventListener('mouseup',this.setMouseUp,false);

		// go ahead and set the canvas dimensions now
		this.updateCanvasDimensions();
	},

	initializeCanvas : function () {
		// initialize the canvas, ctx, etc
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		// add the canvas to the dom
		this.body.appendChild(this.canvas);
	},

	// set the width and the height on the canvas
	updateCanvasDimensions : function () {
		// set the dimensions
		this.canvas.width = this.body.offsetWidth;
		this.canvas.height = this.body.offsetHeight;

		this.onResize();

		// this clears the ctx, so request a redraw
		this.requestRedraw();
	},

	getCurrentMouseMove : function () {
		return this.currentMouseMove;
	},

	getMouseDown : function () {
		return this.mousedown;
	},

	// called when the mouse is depressed
	setMouseDown : function (event) {
		this.mousedown = true;
		this.updateMouseCoordinates(event);
	},

	// called when the mouse is let up
	setMouseUp : function (event) {
		this.mousedown = false;
		this.updateMouseCoordinates(event);
	},

	// updates the latest mouse coordinates
	updateMouseCoordinates : function (event) {
		// since the canvas is sure to be in the top left, and the whole size of the window, this is easy!

		var x = event.clientX,
			y = event.clientY;

		// record this, in the list
		var mouseMove = {x : x, y : y, time : new Date().getTime(), mousedown : this.mousedown};
		this.mouseMoves.push(mouseMove);

		// record the current cursor position
		this.currentMouseMove = mouseMove;
	},

	// boolean, is the loop active
	isDrawLoopActive : function () {
		return this.drawTimeout !== undefined;
	},

	// draw, as fast as you can!
	startDrawLoop : function () {
		this.drawTimeout = setTimeout(this.draw,0);
	},

	stopDrawLoop : function () {
		clearTimeout(this.drawTimeout);
		// set it to undefined, so we know that its inactive
		this.drawTimeout = undefined;
	},

	// draw must call this at the end of its work
	continueDrawLoop : function () {
		this.isDrawLoopActive() && this.startDrawLoop();
	},

	// request a redraw, if the drawing loop is active, do nothing, a draw is pending anyway, otherwise, draw
	requestRedraw : function () {
		!this.isDrawLoopActive() && this.draw();
	},

	getFps : function () {
		var currentTime = new Date().getTime();
		if (this.lastDrawTime) {
			var difference = currentTime - this.lastDrawTime,
				fps = Math.floor(1000 / difference);

			return fps;
		}
		return null;
	},

	// the main drawing thread
	draw : function () {
		this.onDraw(this.ctx);
		this.lastDrawTime = new Date().getTime();

		// clear this array out
		this.mouseMoves.length = 0;
		this.continueDrawLoop();
	},

	// helpers

	// clears the ctx
	// this is a convinience method, for implementers
	clearCtx : function () {
		var ctx = this.ctx,
			canvas = this.canvas;

		ctx.clearRect(0,0,canvas.width,canvas.height);
	},

	getMouseMoves : function () {
		return this.mousemoves;
	},

	// gets only the mousemoves where the mouse was down
	// convinience method
	getMouseDownMoves : function () {
		return this.mouseMoves.filter(function (move) {
			return move.mousedown;
		},this);

	},

	getMouseDownVector : function () {
		var mouseDownMoves = this.getMouseDownMoves();
		if (mouseDownMoves.length) {
			var oldMove = mouseDownMoves[0],
				newMove = mouseDownMoves[mouseDownMoves.length - 1];

			return new Vector(newMove.x - oldMove.x,newMove.y - oldMove.y);

		} else {
			return new Vector(0,0);
		}
	}
};

// I really need this, sorry
(function () {
	// cache a ref, for SPEED
	var slice = Array.prototype.slice;

	// just like in Prototype.js
	Function.prototype.bind = function (ctx) {
		var tackyArgs = slice.call(arguments,1),
			fn = this;

		return function () {
			return fn.apply(ctx,tackyArgs.concat(slice.call(arguments)));
		};
	};

	Array.prototype.last = function () {
		return this[this.length - 1];
	};
})();
