// helps manange a pile of particles
var ParticleSet = function (ctx) {
	this.ctx = ctx;
	this.particles = [];
};

ParticleSet.prototype = {
	process : function () {
		var remainingParticles = this.getParticles().filter(function (particle) {
			return particle.draw() !== false;
		},this);
		Array.prototype.splice.apply(this.particles,[0,this.particles.length].concat(remainingParticles));
	},
	addParticle : function (particle) {
		particle.ctx = this.ctx;
		this.particles.push(particle);
	},
	getParticles : function () {
		return this.particles;
	}
};
