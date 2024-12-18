const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const franklin = {
	facingRight: false,
	stepping: false,
	canJump: true,
	landed: false,
	landingTimer: 0,
	stepsTaken: 5,
	frankStepRight: document.getElementById("frankStepRight"),
	frankStepLeft: document.getElementById("frankStepLeft"),
	frankRestRight: document.getElementById("frankRestRight"),
	frankRestLeft: document.getElementById("frankRestLeft"),
	frankLandRight: document.getElementById("frankLandRight"),
	frankLandLeft: document.getElementById("frankLandLeft"),
	frankJumpRight: document.getElementById("frankJumpRight"),
	frankJumpLeft: document.getElementById("frankJumpLeft"),
	position: {
		x: 200,
		y: 200,
	},
	force: {
		x: 0,
		y: 1,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	acceleration: {
		x: 0,
		y: 0,
	},
	hitbox: {
		w: 30,
		h: 55,
	},
	pixelWalk: function() {
		if (franklin.velocity.x > 0) {
			franklin.position.x = Math.ceil(franklin.position.x / 5) * 5;
		}
		if (franklin.velocity.x < 0) {
			franklin.position.x = Math.floor(franklin.position.x / 5) * 5;
		}
	},
	show: function() {
		if (rightPressed == true) {
			this.facingRight = true;
		}
		if (leftPressed == true) {
			this.facingRight = false;
		}
		if (this.facingRight == true) {
			if (this.velocity.y != 0 || !this.canJump) {
				ctx.drawImage(this.frankJumpRight, this.position.x, this.position.y);
			} else if (this.landed) {
				ctx.drawImage(this.frankLandRight, this.position.x, this.position.y);
			} else {
				if (this.stepping) {
					ctx.drawImage(this.frankStepRight, this.position.x, this.position.y);
				} else {
					ctx.drawImage(this.frankRestRight, this.position.x, this.position.y);
				}
			}
		} else {
			if (this.velocity.y != 0 || !this.canJump) {
				ctx.drawImage(this.frankJumpLeft, this.position.x, this.position.y);
			} else if (this.landed) {
				ctx.drawImage(this.frankLandLeft, this.position.x, this.position.y);
			} else {
				if (this.stepping) {
					ctx.drawImage(this.frankStepLeft, this.position.x, this.position.y);
				} else {
					ctx.drawImage(this.frankRestLeft, this.position.x, this.position.y);
				}
			}
		}
	},
}

const obstacle1 = new SquareObstacle(150, 200, 50, "platform");
const obstacle2 = new SquareObstacle(200, 200, 50, "platform");
const obstacle3 = new SquareObstacle(250, 200, 50, "platform");

const obstacle4 = new SquareObstacle(200, 500, 50, "platform");
const obstacle5 = new SquareObstacle(250, 500, 50, "platform");
const obstacle6 = new SquareObstacle(300, 500, 50, "platform");

const obstacle7 = new SquareObstacle(400, 400, 50, "platform");
const obstacle8 = new SquareObstacle(400, 250, 50, "platform");
const obstacle9 = new SquareObstacle(400, 100, 50, "platform");

const obstacle10 = new SquareObstacle(0, 300, 50, "platform");

let frameCount = 0;

function gameLoop() {
	clear();
	inputs();
	obstacle1.show(ctx);
	obstacle2.show(ctx);
	obstacle3.show(ctx);
	obstacle4.show(ctx);
	obstacle5.show(ctx);
	obstacle6.show(ctx);
	obstacle7.show(ctx);
	obstacle8.show(ctx);
	obstacle9.show(ctx);
	obstacle10.show(ctx);
	franklin.show();
	console.log(franklin.landed);
	frameCount += 1;
	requestAnimationFrame(gameLoop);
};

function inputs() {
	// === KEYPRESSES === //
	if (leftPressed) {
		franklin.force.x = -1;
	}
	if (rightPressed) {
		franklin.force.x = 1;
	}
	if (!leftPressed && !rightPressed) {
		franklin.force.x = 0;
		franklin.stepping = false;
	}
	if (upPressed) {
		if (franklin.canJump) {
			if (franklin.velocity.y < 0) {
				franklin.velocity.y = -5;
			} else {
				franklin.velocity.y = -22;
			}
		}
		franklin.canJump = false;
	}
	

	if (shouldSlow()) {
		franklin.velocity.x = takeToZero(franklin.velocity.x, 0); 
		franklin.stepping = false;
	}

	let previousPositionX = franklin.position.x;
	
	franklin.velocity.x += franklin.force.x;
	franklin.position.x += franklin.velocity.x / 3;
	franklin.pixelWalk();
	franklin.velocity.y += franklin.force.y;
	franklin.position.y += franklin.velocity.y;
	franklin.position.y = Math.ceil(franklin.position.y / 5) * 5;
	
	if (previousPositionX != franklin.position.x) {
		if (franklin.stepsTaken % 4 == 0) {
			if (franklin.stepping) {
				franklin.stepping = false;
			} else {
				franklin.stepping = true;
			}
		}
		franklin.stepsTaken += 1;
	}

	if (franklin.velocity.x > 10) {
		franklin.velocity.x = 10;
	}
	if (franklin.velocity.x < -10) {
		franklin.velocity.x = -10;
	}
	
	
	// === COLLISSIONS === //
	objectCollision(franklin, obstacle1);
	objectCollision(franklin, obstacle2);
	objectCollision(franklin, obstacle3);
	objectCollision(franklin, obstacle4);
	objectCollision(franklin, obstacle5);
	objectCollision(franklin, obstacle6);
	objectCollision(franklin, obstacle7);
	objectCollision(franklin, obstacle8);
	objectCollision(franklin, obstacle9);
	objectCollision(franklin, obstacle10);
	stayOnScreen();
}

function shouldSlow() {
	if (rightPressed && franklin.velocity.x < 0) {
		return true;
	}
	if (leftPressed && franklin.velocity.x > 0) {
		return true;
	}
	if (!leftPressed && !rightPressed) {
		return true;
	}
	return false;
}

function quadrantRelation(obj1, obj2) {
	if (obj1.position.x >= obj2.position.x &&
		obj1.position.y >= obj2.position.y) {
		return 1;
	}
	if (obj1.position.x >= obj2.position.x &&
		obj1.position.y < obj2.position.y) {
		return 2;
	}
	if (obj1.position.x < obj2.position.x &&
		obj1.position.y < obj2.position.y) {
		return 3;
	}
	if (obj1.position.x < obj2.position.x &&
		obj1.position.y >= obj2.position.y) {
		return 4;
	}
}

function objectCollision(obj1, obj2) {
	let overlapX;
	let overlapY;
	if (doesOverlap(obj1, obj2)) {
		switch(quadrantRelation(obj1, obj2)) {
			case 1:
				overlapX = obj2.position.x + obj2.hitbox.w - obj1.position.x;
				overlapY = obj2.position.y + obj2.hitbox.h - obj1.position.y;
				if (overlapX >= overlapY) {
					stopY(obj2.position.y + obj2.hitbox.h);
				} else {
					stopX(obj2.position.x + obj2.hitbox.w);
				}
				break;
			case 2:
				overlapX = obj2.position.x + obj2.hitbox.h - obj1.position.x;
				overlapY = obj1.position.y + obj1.hitbox.h - obj2.position.y;
				if (overlapX >= overlapY) {
					// === CAM JUMP SPOT === // ============================================== CAN JUMP
					if (!franklin.canJump) {
						franklin.landed = true;
						franklin.landingTimer = 0;
					} else if (franklin.landingTimer < 5) {
						franklin.landingTimer += 1;
					} else {
						franklin.landed = false;
					}
					franklin.canJump = true;
					stopY(obj2.position.y - obj1.hitbox.h);
				} else {
					stopX(obj2.position.x + obj2.hitbox.w);
				}
				break;
			case 3:
				overlapX = obj1.position.x + obj1.hitbox.w - obj2.position.x;
				overlapY = obj1.position.y + obj1.hitbox.h - obj2.position.y;
				if (overlapX >= overlapY) {
					// === CAN JUMP SPOT === // ============================================== CAN JUMP
					if (!franklin.canJump) {
						franklin.landed = true; 
						franklin.landingTimer = 0;
					} else if (franklin.landingTimer < 0) {
						franklin.landingTimer += 1;
					} else {
						franklin.landed = false;
					}
					franklin.canJump = true;
					stopY(obj2.position.y - obj1.hitbox.h);
				} else {
					stopX(obj2.position.x - obj1.hitbox.w);
				}
				break;
			case 4:
				overlapX = obj1.position.x + obj1.hitbox.w - obj2.position.x;
				overlapY = obj2.position.y + obj2.hitbox.h - obj1.position.y;
				if (overlapX >= overlapY) {
					stopY(obj2.position.y + obj2.hitbox.h);
				} else {
					stopX(obj2.position.x - obj1.hitbox.w);
				}
				break;
		}
	}
}

function doesOverlap(obj1, obj2) {
	let overlapLeft = false;
	let overlapRight = false;
	let overlapTop = false;
	let overlapBottom = false;
	if (obj1.position.x + obj1.hitbox.w > obj2.position.x) {
		overlapLeft = true;
	}
	if (obj1.position.x < obj2.position.x + obj2.hitbox.w) {
		overlapRight = true;
	}
	if (obj1.position.y + obj1.hitbox.h > obj2.position.y) {
		overlapTop = true;
	}
	if (obj1.position.y < obj2.position.y + obj2.hitbox.h) {
		overlapBottom = true
	}
	if (overlapLeft && overlapRight && overlapTop && overlapBottom) {
		return true;
	} else {
		return false;
	}
}

function stayOnScreen() {
	if (franklin.position.x < 0) {
		stopX(0);
	}
	if (franklin.hitbox.w + franklin.position.x > canvas.width) {
		stopX(canvas.width - franklin.hitbox.w);
	}
	if (franklin.position.y <= 0) {
		stopY(0);
	}
	if (franklin.hitbox.h + franklin.position.y > canvas.height) {
		stopY(canvas.height - franklin.hitbox.h);
		// === CAN JUMP SPOT === // ========================================================== CAN JUMP
		if (!franklin.canJump) {
			franklin.landed = true;
			franklin.landingTimer = 0;
		} else if (franklin.landingTimer < 5) {
			franklin.landingTimer += 1;
		} else {
			franklin.landed = false;
		}
		franklin.canJump = true;
	}
}

function stopX(xPos) {
	franklin.position.x = xPos;
	franklin.velocity.x = 0;
}

function stopY(yPos) {
	franklin.position.y = yPos;
	franklin.velocity.y = 0;
}

// speed between 0 and 1, 0 is high and 1 is low
function takeToZero(number, speed) {
	if (number > 0) {
		if (number - (1/speed) - 0.1 <= 0) {
			number = 0;
		} else {
			number -= speed*number;
		}
	}
	if (number < 0) {
		if (number + (1/speed) + 0.1 >= 0) {
			number = 0;
		} else {
			number -= speed*number;
		}
	}
	return number;
}

const backBricks = document.getElementById("backBricks");
const pattern = ctx.createPattern(backBricks, "repeat");
function clear() {
	ctx.fillStyle = pattern; 
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

addEventListener("keydown", function (event) {
	switch(event.key) {
		case "a":
			leftPressed = true;
			break;
		case "d":
			rightPressed = true;
			break;
		case "w":
			upPressed = true;
			break;
		case "s":
			downPressed = true;
			break;
	}
});

addEventListener("keyup", function(event) {
	switch(event.key) {
		case "a":
			leftPressed = false;
			break;
		case "d":
			rightPressed = false;
			break;
		case "w":
			upPressed = false;
			break;
		case "s":
			downPressed = false;
			break;
	}
});

gameLoop();