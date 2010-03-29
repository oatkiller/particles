// helps manange a pile of particles
var ParticleSet = function (animation) {
	this.animation = animation;
	this.particles = [];
};

ParticleSet.prototype = {
	onInit : function () {
		this.animation.ctx.globalCompositeOperation = 'lighter';
	},
	process : function () {
		var remainingParticles = this.getParticles().filter(function (particle) {
			return particle.draw() !== false;
		},this);
		Array.prototype.splice.apply(this.particles,[0,this.particles.length].concat(remainingParticles));
	},
	addParticle : function (particle) {
		particle.animation = this.animation;
		this.particles.push(particle);
	},
	getParticles : function () {
		return this.particles;
	}
};
