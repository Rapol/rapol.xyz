"use strict";
(function () {

	let colors = ['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58'];
	let colorCounter = 0;

	let bumps = [];

	// Drawing variables
	let canvas;
	let context;

	canvas = document.getElementById('hero-canvas');
	context = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const BUMP_RADIUS = 10;
	const BUMP_WIDTH = BUMP_RADIUS * 2;
	const BUMP_MIN_RATIO = 1/16;
	const BUMP_MAX_RATIO = 1/3;
	let BUMP_MAX_HEIGHT = canvas.height * BUMP_MAX_RATIO;
	let BUMP_MIN_HEIGHT = canvas.height * BUMP_MIN_RATIO;

	let requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame;

	window.addEventListener('resize', resizeCanvas, false);

	// Resize canvas based on the size of the window, this resets the canvas
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		BUMP_MAX_HEIGHT = canvas.height * BUMP_MAX_RATIO;
		BUMP_MIN_HEIGHT = canvas.height * BUMP_MIN_RATIO;
		bumps = [];
		createBumps();
	}

	var Bump = function (x, y, height, radius, color) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.radius = radius;
		this.color = color

		this.direction = Math.random() < 0.5 ? -1 : 1;
	}

	Bump.prototype.update = function () {
		this.height += this.direction;

		if (canvas.height - this.height >= BUMP_MAX_HEIGHT)
			this.direction = -(this.direction)
		else if (canvas.height - this.height < BUMP_MIN_HEIGHT)
			this.direction = -(this.direction)

		context.beginPath();
		context.moveTo(this.x, this.y);
		context.lineTo(this.x, this.height);
		context.arc(this.x + this.radius, this.height, this.radius, Math.PI, 0);
		context.lineTo(this.x + BUMP_WIDTH, this.y);
		context.lineTo(this.x, this.y);
		context.fillStyle = this.color;

		context.fill();
	}

	createBumps();
	updateCanvas();

	function createBumps() {
		let currentXPos = 0;
		while (currentXPos <= canvas.width) {
			let randomHeight = canvas.height - (Math.floor(Math.random() * (BUMP_MAX_HEIGHT - BUMP_MIN_HEIGHT + 1)) + BUMP_MIN_HEIGHT);
			let bump = new Bump(currentXPos, canvas.height, randomHeight, 10, colors[colorCounter]);
			colorCounter++;
			if (colorCounter > colors.length - 1) {
				colorCounter = 0;
			}
			currentXPos += BUMP_WIDTH;
			bumps.push(bump);
		}
	}

	function updateCanvas() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < bumps.length; i++) {
			let bump = bumps[i];
			bump.update();
		}
		requestAnimationFrame(updateCanvas);
	}
})();