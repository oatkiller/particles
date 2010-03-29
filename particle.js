var particleConstructor = SwarmParticle;
var P = new FullBrowserCanvasAnimation({
	onInit : function () {
		this.particleSet = new ParticleSet(this);
		this.ctx.canvas.style.backgroundColor = '#000';
		this.createParticles();
	},
	createParticles : function () {
		var canvas = this.ctx.canvas,
			xCenter = canvas.width / 2,
			yCenter = canvas.height / 2,
			fakeMouseMove = {x : xCenter, y : yCenter},
			i = 200;

		while (i--) {
			this.createParticle(fakeMouseMove);
		}

	},
	createParticle : function (point) {
		this.particleSet.addParticle(new particleConstructor(point));
	},
	onDraw : function (ctx) {
		this.clearCtx();

/*
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
		*/

		this.particleSet.process();
	}
});
