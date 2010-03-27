var particleConstructor = SwarmParticle;
var P = new FullBrowserCanvasAnimation({
	onInit : function () {
		this.particleSet = new ParticleSet(this);
		this.createFillStyle();
		this.setFillStyle();
	},
	createFillStyle : function () {
		var ctx = this.ctx;
		/*
		this.gradient = ctx.createRadialGradient(0,0,0,0,0,11);
		this.gradient.addColorStop(0,'white');
		this.gradient.addColorStop(1,'black');
		*/

		this.gradient = ctx.createRadialGradient(0,0,0,0,0,10);  
		this.gradient.addColorStop(.5, 'blue');  
		this.gradient.addColorStop(1, 'yellow');  
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
