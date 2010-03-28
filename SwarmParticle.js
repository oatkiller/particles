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

	maxAcceleration : 60,

	maxVelocity : 30,

	getMaxAcceleration : function () {
		return this.animation.getSecondsSinceLastDraw() * this.maxAcceleration;
	},

	// randomly modulate a vectors angle
	modulateAngle : function (vector) {
		var variance = Math.PI / 8,
			randomAngle = (variance * Math.random()) - (variance / 2);

		vector.setTheta(vector.getTheta() + randomAngle);
	},

	accelerate : function () {
		// TODO fix turn radius, and speed adjustment
		var targetMouseMove = this.animation.getCurrentMouseMove();

		var vectorToPoint = this.getVectorToPoint(targetMouseMove);

		var vectorToNewAcceleration = this.getVectorBetweenPoints(this.velocity.getOffsets(),vectorToPoint.getOffsets());

		vectorToNewAcceleration.setScalar(this.getMaxAcceleration());

		this.modulateAngle(vectorToNewAcceleration);

		this.velocity.add(vectorToNewAcceleration);
	},

	getVectorToPoint : function (point) {
		return this.getVectorBetweenPoints(this,point);
	},

	getVectorBetweenPoints : function (p1,p2) {
		var vector = new Vector(p2.x-p1.x,p2.y-p1.y);
		return vector;
	},

	capVelocity : function () {
		if (this.velocity.getScalar() > this.maxVelocity) {
			this.velocity.setScalar(this.maxVelocity);
		}
	},

	getWallBoundaries : function () {
		var canvas = this.animation.ctx.canvas;

		return {
			top : 0,
			right : canvas.width,
			bottom : canvas.height,
			left : 0
		};
	},

	collideWithWalls : function () {
		var wallBoundaries = this.getWallBoundaries(),
			c = .98;

		if (this.x < wallBoundaries.left || this.x > wallBoundaries.right) {
			// collided with left wall or with right wall
			this.velocity.setX(this.velocity.getX() * -c);
		} else if (this.y < wallBoundaries.top || this.y > wallBoundaries.bottom) {
			// collided with top wall with bottom wall
			this.velocity.setY(this.velocity.getY() * -c);
		}
	},

	// apply the velocity to the coords
	applyVelocity : function () {
		var offsets = this.velocity.getOffsets();
		this.x += offsets.x;
		this.y += offsets.y;
	},

	draw : function () {
		this.accelerate();
		this.collideWithWalls();
		this.capVelocity();
		this.applyVelocity();
		
		var ctx = this.animation.ctx;
		ctx.save();

		ctx.translate(this.x,this.y);
		ctx.fillRect(-5,-5,10,10);

		ctx.restore();
	}
};
