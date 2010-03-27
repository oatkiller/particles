var particleConstructor = SwarmParticle;
var P = new FullBrowserCanvasAnimation({
	onInit : function () {
		this.particleSet = new ParticleSet(this);
	},
	onResize : function () {
		this.ctx.fillStyle = 'blue';
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
