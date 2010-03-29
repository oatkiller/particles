var SwarmParticle = function (mousemove) {
	this.x = mousemove.x;
	this.y = mousemove.y;

	this.velocity = this.getRandomVelocity();
	//this.velocity = new Vector(1,0);

	this.color = this.getRandomRGB();

	this.lastTime = new Date().getTime();
};

SwarmParticle.prototype = {
	// a vector object
	velocity : null,

	angle : Math.PI * 2,

	maxAcceleration : 70,

	maxVelocity : 1500,

	maxRadius : 20,

	minRadius : 4,

	getRandomRGB : function () {
		var variance = 96,
			stable = 255 - variance,
			getVariance = this.getRandomNumber.bind(this,0,variance),
			getColor = function () {
				return Math.floor(stable + getVariance());
			};

		return {
			r : getColor(),
			g : getColor(),
			b : getColor()
		};
	},

	getRGBAString : function (rgb,a) {
		return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + a + ')';
	},

	getRandomColor : function (alpha) {

		return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
	},

	getRandomNumber : function (l,u) {
		var difference = u - 1;
		return (Math.random() * difference) - (difference / 2);
	},

	getRandomVelocity : function () {
		var n = 30;
		return new Vector(this.getRandomNumber(-n,n),this.getRandomNumber(-n,n));
	},

	getMaxAcceleration : function () {
		return this.animation.getSecondsSinceLastDraw() * this.maxAcceleration;
	},

	getMaxVelocity : function () {
		return this.maxVelocity * this.animation.getSecondsSinceLastDraw();
	},

	// randomly modulate a vectors angle
	modulateAngle : function (vector) {
		var variance = Math.PI / 12,
			randomAngle = this.getRandomNumber(-variance,variance);
			//randomAngle = (variance * Math.random()) - (variance / 2);

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
		var maxVelocity = this.getMaxVelocity();
		if (this.velocity.getScalar() > maxVelocity) {
			this.velocity.setScalar(maxVelocity);
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

	bounceConstant : -.98,

	flipYVelocity : function () {
		this.velocity.setY(this.velocity.getY() * this.bounceConstant);
	},

	flipXVelocity : function () {
		var newVelocity = this.velocity.getX() * this.bounceConstant;
		this.velocity.setX(newVelocity);
	},

	collideWithWalls : function () {
		var wallBoundaries = this.getWallBoundaries(),
			c = .98,
			velocityX = this.velocity.getX(),
			velocityY = this.velocity.getY();

		if (this.x > wallBoundaries.right) {
			this.x = wallBoundaries.right;
			if (velocityX > 0) {
				this.flipXVelocity();
			}
		} 
		if (this.x < wallBoundaries.left) {
			this.x = wallBoundaries.left;
			if (velocityX < 0) {
				this.flipXVelocity()
			}
		} 
		if (this.y < wallBoundaries.top) {
			this.y = wallBoundaries.top;
			if (velocityY < 0) {
				this.flipYVelocity();
			}
		} 
		if (this.y > wallBoundaries.bottom) {
			this.y = wallBoundaries.bottom;
			if (velocityY > 0) {
				this.flipYVelocity();
			}
		}
	},

	getRadius : function () {
		var velocity = this.velocity.getScalar(),
			maxVelocity = this.getMaxVelocity(),
			r = ((isNaN(velocity) ? .1 : velocity) / maxVelocity) * (this.maxRadius - this.minRadius) + this.minRadius;

		return r;
	},

	setFillStyle : function (r) {
		var ctx = this.animation.ctx;

		r = r || this.getRadius();

		var gradient = ctx.createRadialGradient(0,0,0,0,0,r / 2);
		gradient.addColorStop(0,this.getRGBAString(this.color,.8));
		gradient.addColorStop(.8,this.getRGBAString(this.color,.2));
		gradient.addColorStop(1,this.getRGBAString(this.color,0));

		ctx.fillStyle = gradient;
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

		var r = this.getRadius();

		this.setFillStyle(r);

		var halfR = r / 2;

		ctx.fillRect(-halfR,-halfR,r,r);

		ctx.restore();
	}
};
