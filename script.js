var canvas, ctx, targetX, targetY, circles, flag;
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

window.onload = function () {
	canvas = document.getElementById("canvas");
	canvas.width = 0.9 * window.innerWidth;
	canvas.height = 0.9 * window.innerHeight;
	ctx = canvas.getContext("2d");
	drawBorder();
	targetX = isFinite(localStorage.getItem("targetX")) ? parseInt(localStorage.getItem("targetX")) : undefined;
	targetY = isFinite(localStorage.getItem("targetY")) ? parseInt(localStorage.getItem("targetY")) : undefined;
	if (targetX && targetY) {
		drawCircle(targetX, targetY);
	}
	circles = new Array();
	if (localStorage.circles && localStorage.circles !== "undefined") {
		circles = JSON.parse(localStorage.circles);
	}
	updateStorage();
	flag = false;
	setTimeout(function () {
		moveCircles()
	}, 0);

	canvas.addEventListener("click", function (e) {
		coords = canvas.relMouseCoords(e);
		canvasX = coords.x;
		canvasY = coords.y;
		if ((!isFinite(targetX) || !isFinite(targetY)) && canvasX <= canvas.width / 2 - 25) {
			targetX = canvasX;
			targetY = canvasY;
			updateStorage();
			drawCircle(targetX, targetY);
		}
	});

	canvas.addEventListener("mousedown", function (e) {
		coords = canvas.relMouseCoords(e);
		canvasX = coords.x;
		canvasY = coords.y;
		if ((targetX - canvasX) * (targetX - canvasX) + (targetY - canvasY) * (targetY - canvasY) <= (20) * (20)) {
			flag = true;
		}
	});

	canvas.addEventListener("mouseup", function (e) {
		flag = false;
	});

	canvas.addEventListener("mousemove", function (e) {
		if (flag) {
			coords = canvas.relMouseCoords(e);
			canvasX = coords.x;
			canvasY = coords.y;
			if (canvasX <= canvas.width / 2 - 25) {
				targetX = canvasX;
				targetY = canvasY <= canvas.height ? canvasY : canvas.height;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				drawCircle(targetX, targetY);
				drawBorder();
			} else if (canvasX <= canvas.width) {
				circles[circles.length] = new circle(canvas.width / 2 + 25, canvasY);
				targetX = undefined;
				targetY = undefined;
				flag = false;
			}
			updateStorage();
		}
	});
}

function circle(xPos, yPos) {
	this.xPos = xPos;
	this.yPos = yPos;
	this.xPrev = undefined;
	this.yPrev = undefined;
	this.xVel = undefined;
	this.yVel = undefined;
}

function relMouseCoords(event) {
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	var canvasX = 0;
	var canvasY = 0;
	var currentElement = this;

	do {
		totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
		totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
	} while (currentElement = currentElement.offsetParent)

	canvasX = event.pageX - totalOffsetX;
	canvasY = event.pageY - totalOffsetY;

	return {
		x : canvasX,
		y : canvasY
	}
}

function moveCircles() {
	if (circles.length > 0) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (var i = 0; i < circles.length; i++) {
			if (!isFinite(circles[i].xVel) || !isFinite(circles[i].yVel)) {
				circles[i].xVel = Math.floor((Math.random() * 4) + 1);
				circles[i].yVel = Math.floor((Math.random() * 4) + 1) * signum(Math.random() - 0.5);
			}
			circles[i].xPrev = circles[i].xPos;
			circles[i].yPrev = circles[i].yPos;
			circles[i].xPos += circles[i].xVel;
			circles[i].yPos += circles[i].yVel;
			if (circles[i].xPos + 20 >= canvas.width) {
				circles[i].xPos = canvas.width - 20 - (Math.abs(circles[i].xVel) - (canvas.width - circles[i].xPrev - 20));
				circles[i].xVel = circles[i].xVel * (-1);
			}
			if (circles[i].xPos - 20 <= canvas.width / 2) {
				circles[i].xPos = canvas.width / 2 + 20 + (Math.abs(circles[i].xVel) - (circles[i].xPrev - 20 - canvas.width / 2));
				circles[i].xVel = circles[i].xVel * (-1);
			}
			if (circles[i].yPos + 20 >= canvas.height) {
				circles[i].yPos = canvas.height - 20 - (Math.abs(circles[i].yVel) - (canvas.height - circles[i].yPrev - 20));
				circles[i].yVel = circles[i].yVel * (-1);
			}
			if (circles[i].yPos - 20 <= 0) {
				circles[i].yPos = 0 + 20 + (Math.abs(circles[i].yVel) - (circles[i].yPrev - 20 - 0));
				circles[i].yVel = circles[i].yVel * (-1);
			}
			drawCircle(circles[i].xPos, circles[i].yPos);
			updateStorage();
		}
		drawCircle(targetX, targetY);
		drawBorder();
	}
	setTimeout(function () {
		moveCircles()
	}, 20);
}

function drawCircle(targetX, targetY) {
	ctx.beginPath();
	ctx.arc(targetX, targetY, 20, 0, 2 * Math.PI);
	ctx.stroke();
}

function drawBorder() {
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();
}

function signum(m) {
	return m > 0 ? 1 : -1;
}

function updateStorage() {
	localStorage.setItem("targetX", targetX);
	localStorage.setItem("targetY", targetY);
	localStorage.setItem("circles", JSON.stringify(circles));
}

function clearStorage() {
	localStorage.removeItem("targetX");
	localStorage.removeItem("targetX");
	localStorage.removeItem("circles");
	targetX = undefined;
	targetY = undefined;
	circles = new Array();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBorder();
}
