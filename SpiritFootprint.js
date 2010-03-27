var SpiritFootprint = function (mouseMove,previousMouseMove) {
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
