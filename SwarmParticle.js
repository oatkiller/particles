var SwarmParticle = function (mousemove) {
	this.x = mousemove.x;
	this.y = mousemove.y;

	this.velocity = new Vector(1,0);

	this.lastTime = new Date().getTime();
};

SwarmParticle.prototype = {
	// a vector object
	velocity : null,

	angle : Math.PI * 2,

	maxAcceleration : 20,

	getMaxAcceleration : function () {
		return this.animation.getSecondsSinceLastDraw() * this.maxAcceleration;
	},

	accelerate : function () {
		// TODO fix turn radius, and speed adjustment
		var targetMouseMove = this.animation.getCurrentMouseMove();

		var vectorToPoint = this.getVectorToPoint(targetMouseMove);

		var vectorToNewAcceleration = this.getVectorBetweenPoints(this.velocity.getOffsets(),vectorToPoint.getOffsets());

		vectorToNewAcceleration.setScalar(this.getMaxAcceleration());

		this.velocity.add(vectorToNewAcceleration);
	},

	getVectorToPoint : function (point) {
		return this.getVectorBetweenPoints(this,point);
	},

	getVectorBetweenPoints : function (p1,p2) {
		var vector = new Vector(p2.x-p1.x,p2.y-p1.y);
		return vector;
	},

	// apply the velocity to the coords
	applyVelocity : function () {
		var offsets = this.velocity.getOffsets();
		this.x += offsets.x;
		this.y += offsets.y;
	},

	draw : function () {
		this.accelerate();
		this.applyVelocity();
		
		var ctx = this.animation.ctx;
		ctx.save();

		ctx.translate(this.x,this.y);
		ctx.fillRect(-5,-5,10,10);

		ctx.restore();
	}
};
