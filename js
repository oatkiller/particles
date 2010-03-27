/* config takes,
stopped : defaults to false, it true, wont start drawing automatically
onDraw : required, the method is passed a ctx, over and over again. draw cool stuff to it
				also, ctx will have special properties, mouseX and mouseY, which represent the latest mouse coordinates, relative to the top of the canvas
*/

var FullBrowserCanvasAnimation = function (config) {
	// get a reference to the onDraw method passed
	this.onDraw = config && config.onDraw || function () {};

	// get a personal version of these, since we need to use them without context
	'draw updateCanvasDimensions updateMouseCoordinates'.split(' ').forEach(function (property) {
		this[property] = this[property].bind(this);
	},this);

	// this has to come first
	this.initializeCanvas();

	// because this calls the canvas
	this.initializeBody();

	// start the loop unless stopped was passed
	(!config || !config.stopped) && this.startDrawLoop();
};

FullBrowserCanvasAnimation.prototype = {
	// the timeout reference for the main draw loop
	// should be set to undefined when inactive
	drawTimeout : undefined,

	// the body, this can only run in a browser, so!
	body : document.body,

	// this will be the canvas element
	canvas : null,

	// this will be the canvas 2d context
	ctx : null,

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

		// this clears the ctx, so request a redraw
		this.requestRedraw();
	},

	// updates the latest mouse coordinates
	updateMouseCoordinates : function (event) {
		// since the canvas is sure to be in the top left, and the whole size of the window, this is easy!
		this.ctx.mouseX = event.x;
		this.ctx.mouseY = event.y;
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

	// the main drawing thread
	draw : function () {
		this.onDraw(this.ctx);
		this.continueDrawLoop();
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
})();

/*
// testing
var P = new FullBrowserCanvasAnimation({
	onDraw : function (ctx) {
		document.title = new Date() + ctx.mouseX + ' ' + ctx.mouseY + ' ' + ctx.canvas.width + ' ' + ctx.canvas.height;
	}
});
*//
