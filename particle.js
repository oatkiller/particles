var particleConstructor = SwarmParticle;
var P = new FullBrowserCanvasAnimation({
	onInit : function () {
		this.particleSet = new ParticleSet(this);
		this.createFillStyle();
		this.setFillStyle();
		this.ctx.canvas.style.backgroundColor = '#000';
	},
	createFillStyle : function () {
		var ctx = this.ctx;
		var gradient = ctx.createRadialGradient(0,0,0,0,0,5);
		gradient.addColorStop(0,'rgba(100,120,240,.5)');
		gradient.addColorStop(.85,'rgba(100,120,240,.2)');
		gradient.addColorStop(1,'rgba(100,120,240,0)');

		this.gradient = gradient;
	},
	setFillStyle : function () {
		this.ctx.fillStyle = this.gradient;
	},
	onResize : function () {
		this.setFillStyle();
	},
	onDraw : function (ctx) {
		this.clearCtx();

		// filter out mousemoves that had no button press
		var mouseDownMouseMoves = this.getMouseDownMoves();

		if (mouseDownMouseMoves.length) {
			// add new particles
			mouseDownMouseMoves.forEach(function (move) {
				this.particleSet.addParticle(new particleConstructor(move));
			},this);

		} else if (this.getMouseDown()) {
			// the mouse is down, but not moving. use the last location
			this.particleSet.addParticle(new particleConstructor(this.getCurrentMouseMove()));
		}

		this.particleSet.process();
	}
});
