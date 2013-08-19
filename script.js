var canvas = document.getElementById("canvas");
canvas.width = 0.9 * window.innerWidth;
canvas.height = 0.9 * window.innerHeight;
var ctx = canvas.getContext("2d");
var targetX = undefined, targetY = undefined;
var flag = false;

canvas.addEventListener("click", function (e) {
	if (targetX == undefined || targetY == undefined) {
		targetX = e.clientX;
		targetY = e.clientY;
		drawCircle(targetX, targetY);
	}
});

canvas.addEventListener("mousedown", function (e) {
	if ((targetX - e.clientX) * (targetX - e.clientX) + (targetY - e.clientY) * (targetY - e.clientY) <= (20) * (20)) {
		flag = true;
	}
});

canvas.addEventListener("mousemove", function (e) {
	if (flag) {
		ctx.clearRect(0, 0, canvas.width / 2 - 1, canvas.height);
		targetX = e.clientX <= canvas.width / 2 - 25 ? e.clientX : canvas.width / 2 - 25;
		targetY = e.clientY <= canvas.height ? e.clientY : canvas.height;
		drawCircle(targetX, targetY);
	}
});

canvas.addEventListener("mouseup", function (e) {
	flag = false;
});

function drawCircle(targetX, targetY) {
	ctx.beginPath();
	ctx.arc(targetX, targetY, 20, 0, 2 * Math.PI);
	ctx.stroke();
}
