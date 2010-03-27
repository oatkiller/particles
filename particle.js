var distance = function (x1,y1,x2,y2) {
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
};

var SpiritFootprint = function (ctx,mouseMove,previousMouseMove) {
	this.ctx = ctx;

	// draw yourself at the current mousemove
	this.x = mouseMove.x;
	this.y = mouseMove.y;

	// record its birth
	this.birthday = new Date().getTime();
};

SpiritFootprint.prototype = {
	// the ctx to draw to
	ctx : null,

	// its x coord
	x : null,

	// its y coord
	y : null,

	// how fast the mouse was moving when it was created determines the size
	size : 10,

	// default time to die, 5 secs
	lifespan : 2000,

	// just store the radians of a circle...
	angle : Math.PI * 2,

	// draw it!
	draw : function () {
		var currentTime = new Date().getTime();
		if (this.birthday + this.lifespan > currentTime) {
			var ctx = this.ctx;
			var intensity = 1 - ((currentTime - this.birthday) / this.lifespan);
			ctx.fillStyle = 'rgba(100,100,255,' + intensity + ')';
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.size,0,this.angle,true);
			ctx.fill();
		} else {
			// dead
			return false;
		}
	}
};

var P = new FullBrowserCanvasAnimation({
	onInit : function () {
		this.particles = [];
	},
	onResize : function () {
		this.ctx.fillStyle = 'blue';
	},
	onDraw : function (ctx) {
		this.clearCtx();

		// filter out mousemoves that had no button press
		Array.prototype.splice.apply(this.mouseMoves,[0,this.mouseMoves.length].concat(this.mouseMoves.filter(function (move) {
			return move.mousedown;
		},this)));

		// seed mouseMoves
		this.mouseMoves.unshift(this.lastMouseMove || this.mouseMoves[0]);

		// add new particles
		this.mouseMoves.forEach(function (move,i,mouseMoves) {
			if (i === 0) {
				return;
			}
			this.particles.push(new SpiritFootprint(ctx,move,mouseMoves[i - 1]));
		},this);

		// get a copy of particles
		var particles = this.particles.slice();

		// empty particles
		this.particles.length = 0;
		
		// draw them all, restore living ones
		particles.forEach(function (particle) {
			particle.draw() !== false && this.push(particle);
		},this.particles);

		// store the last mouse move, for next time
		this.lastMouseMove = this.mouseMoves[this.mouseMoves.length - 1];
	}
});
