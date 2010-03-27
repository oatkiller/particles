var Vector = function (x,y) {
	this.x = x;
	this.y = y;
};

Vector.prototype = {
	getX : function () {
		return this.x;
	},
	getY : function () {
		return this.y;
	},
	getOffsets : function () {
		return {x : this.x, y : this.y};
	},
	getScalar : function () {
		var x = this.x,
			y = this.y;

		return Math.sqrt((x*x) + (y*y));
	},
	getTheta : function () {
		return Math.atan(this.y / this.x);
	},
	getScalarAndTheta : function () {
		return {
			theta : this.getTheta(),
			scalar : this.getScalar()
		};
	},
	setScalarAndTheta : function (scalar,theta) {
		this.x = scalar * Math.cos(theta);
		this.y = scalar * Math.sin(theta);
		return this;
	},
	setTheta : function (theta) {
		var scalar = this.getScalar();
		this.setScalarAndTheta(scalar,theta);
		return this;
	},
	setScalar : function (scalar) {
		var theta = this.getTheta();
		this.setScalarAndTheta(scalar,theta);
		return this;
	},
	setX : function (x) {
		this.x = x;
		return this;
	},
	setY : function (y) {
		this.y = y;
		return this;
	}
	add : function (otherVector) {
		this.x += otherVector.x;
		this.y += otherVector.y;
		return this;
	},
	getClone : function () {
		return new Vector(this.x,this.y);
	},
	flipHorizontally : function () {
		this.y = this.y * -1;
	},
	flipVertically : function () {
		this.x = this.x * -1;
	}
};

var getVectorFromScalarAndTheta = function (scalar,theta) {
	return new Vector(scalar * Math.cos(theta),scalar * Math.sin(theta));
};

var getVectorFromOffsets = function (x,y) {
	return new Vector(x,y);
};
