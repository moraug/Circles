var canvas, ctx, targetX, targetY, circles, flag;
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

window.onload = function () {
	canvas = document.getElementById("canvas");
	canvas.width = 0.9 * window.innerWidth;
	canvas.height = 0.8 * window.innerHeight;
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
			collision(i);
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

function signum(m) {
	return m > 0 ? 1 : -1;
}

function collision(n) {
	var circle = circles[n];
	for (var i = 0; i < circles.length; i++) {
		if (i != n && (circles[i].xPos - circles[n].xPos) * (circles[i].xPos - circles[n].xPos) + (circles[i].yPos - circles[n].yPos) * (circles[i].yPos - circles[n].yPos) <= (2*20)*(2*20)) {
			//console.log(i+" "+n);
			//circles[n].xPos = circles[n].xPrev;
			//circles[n].yPos = circles[n].yPrev;
			var x1n = circles[i].xPos;
			var y1n = circles[i].yPos;
			var x2p = circles[n].xPrev;
			var y2p = circles[n].xPrev;
			var x2v = circles[n].xVel;
			var y2v = circles[n].yVel;
			var a = x2p-x1n;
			var b = x2v;
			var c = y2p-y1n;
			var d = y2v;
			var Det = -4*(a*b+c*d)*(a*b+c*d)+4*(b*b+d*d)*(a*a+c*c-(2*20)*(2*20));
			var t1 = (-2*(a*b+c*d)+Math.sqrt(Det))/(2*(b*b+d*d));
			var t2 = (-2*(a*b+c*d)-Math.sqrt(Det))/(2*(b*b+d*d));
			var t = Math.min(t1,t2)<0?Math.max(t1,t2):Math.min(t1,t2);
			console.log(t1+" "+t2);
		}
	}
}
