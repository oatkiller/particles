/*
var P = new FullBrowserCanvasAnimation({
// some code to try out spiritfootprint
var P = new FullBrowserCanvasAnimation({
	onInit : function () {
		this.particleSet = new ParticleSet(this.ctx);
	},
	onResize : function () {
		this.ctx.fillStyle = 'blue';
	},
	onDraw : function (ctx) {
		this.clearCtx();

		// filter out mousemoves that had no button press
		var mouseDownMouseMoves = this.getMouseDownMoves();
		// seed mouseMoves
		mouseDownMouseMoves.unshift(this.lastMouseMove || mouseDownMouseMoves[0]);

		// add new particles
		mouseDownMouseMoves.forEach(function (move,i,mouseMoves) {
			if (i === 0) {
				return;
			}
			this.particleSet.addParticle(new SpiritFootprint(move,mouseMoves[i - 1]));
		},this);

		this.particleSet.process();

		// store the last mouse move, for next time
		this.lastMouseMove = mouseDownMouseMoves[mouseDownMouseMoves.length - 1];
	}
});
*/

var P = new FullBrowserCanvasAnimation({
	onInit : function () {
		this.particleSet = new ParticleSet(this.ctx);
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
				this.particleSet.addParticle(new GravityParticle(move));
			},this);

		} else if (this.getMouseDown()) {
			// the mouse is down, but not moving. use the last location
			this.particleSet.addParticle(new GravityParticle(this.getCurrentMouseMove()));
		}

		this.particleSet.process();
	}
});
