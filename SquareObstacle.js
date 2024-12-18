class SquareObstacle {
	constructor (posx, posy, w, drawing) {
		this.position = {
			x: posx,
			y: posy,
		};
		this.hitbox = {
			w: w,
			h: w,
		};
		if (drawing) {
			this.drawing = document.getElementById(drawing);
		}
	}
	show(ctx) {
		if (this.drawing) {
			ctx.fillStyle = ctx.createPattern(this.drawing, "repeat");
			ctx.fillRect(this.position.x, this.position.y, this.hitbox.w, this.hitbox.h);
		} else {
			ctx.fillStyle = "blue";
			ctx.fillRect(this.position.x, this.position.y, this.hitbox.w, this.hitbox.h);
		}
	}
}