var P = new FullBrowserCanvasAnimation({
	onResize : function () {
		this.ctx.fillStyle = 'blue';
	},
	onDraw : function (ctx) {
		this.clearCtx();
		ctx.fillRect(ctx.mouseX,ctx.mouseY,10,10);
	}
});
