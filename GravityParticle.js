var GravityParticle = function (mousemove) {
	this.x = mousemove.x;
	this.y = mousemove.y;

	this.velocity = new Vector(0,0);

	this.lastTime = new Date().getTime();
};

GravityParticle.prototype = {
	// a vector object
	velocity : null,

	angle : Math.PI * 2,

	draw : function () {
		this.applyGravity();
		this.checkSpeed();
		this.applyVelocity();
		
		if (!this.isDead()) {
			var ctx = this.animation.ctx;
			ctx.beginPath();
			ctx.arc(this.x,this.y,10,0,this.angle,false);
			ctx.fill();
		} else { 
			return false;
		}
	},

	// max allowed speed
	terminalSpeed : 30,

	// the force of gravity!
	gravity : 10,

	// keeps speed in check
	checkSpeed : function () {
		if (this.velocity.getScalar() > this.terminalSpeed) {
			this.velocity.setScalar(this.terminalSpeed);
		}
	},

	// apply the velocity to the coords
	applyVelocity : function () {
		var offsets = this.velocity.getOffsets();
		this.x += offsets.x;
		this.y += offsets.y;
	},

	// if it goes off screen, its dead
	isDead : function () {
		return this.x < 0 || this.x > this.animation.ctx.canvas.width || this.y < 0 || this.y > this.animation.ctx.canvas.height;
	},

	applyGravity : function () {
		var currentTime = new Date().getTime(),
			timePassed = currentTime - this.lastTime,
			fractionOfASecond = timePassed / 1000;

		var gravityApplied = fractionOfASecond * this.gravity;
		this.velocity.add(new Vector(0,gravityApplied));

		this.lastTime = currentTime;
	}
};
