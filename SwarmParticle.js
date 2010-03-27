// testing
pointAt = function (ctx,p) {
	ctx.beginPath();
	ctx.moveTo(p.x,p.y);
	var oldStyle = ctx.fillStyle;
	ctx.fillStyle = 'red';
	ctx.arc(p.x,p.y,3,0,Math.PI*2,false);
	ctx.fill();
	ctx.fillStyle = oldStyle;
};
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

	maxSpeed : 4,

	maxTurnAngle : Math.PI / 2,

	maxDeceleration : .1,

	accelerate : function () {
		// TODO fix turn radius, and speed adjustment
		var targetMouseMove = this.animation.getCurrentMouseMove();

		var targetAngle = this.getAngleBetweenMousePoints(this,targetMouseMove);

		if (isNaN(targetAngle)) {
			return;
		}

		//var distanceToTarget = this.getDistanceBetweenMousePoints(this,targetAngle);
		//var newSpeed = distanceToTarget > this.maxSpeed ? this.maxSpeed : distanceToTarget;

		this.velocity.setScalarAndTheta(10,targetAngle);

/*

		var myAngle = this.velocity.getTheta(),
			myMaxTurnAngle = this.getMaxTurnAngle();

		if (Math.abs(myAngle - targetAngle) > myMaxTurnAngle) { 
			// its to big a turn, lets make the max turn
			if (targetAngle > myAngle) {
				// we need to add angle
				this.velocity.setTheta(myAngle + myMaxTurnAngle);
			} else {
				this.velocity.setTheta(myAngle - myMaxTurnAngle);
			}
		} else {
			// we can make it
			this.velocity.setTheta(targetAngle);
		}
		*/
	},

	getDistanceBetweenMousePoints : function (m1,m2) {
		return Math.sqrt(Math.pow(m2.x-m1.x,2) + Math.pow(m2.y-m1.y,2));
	},

	getAngleBetweenMousePoints : function (m1,m2) {
		var theta = new Vector(m2.x-m1.x,m2.y-m1.y).getTheta();
		// trig doesn't respect quadrants... dumb
		if (m1.x > m2.x) {
			theta += Math.PI;
		}
		return theta;
	},

	getMaxTurnAngle : function () {
		var speed = this.velocity.getScalar(),
			percent = speed / this.maxSpeed,
			difference = 1 - percent;

		return this.maxTurnAngle * difference;
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
		ctx.beginPath();
		ctx.arc(this.x,this.y,10,0,this.angle,false);
		ctx.fill();
	}
};
