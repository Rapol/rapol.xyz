"use strict";

(function () {

	let colors = ['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58'];
	let colorCounter = 0;

	// houses all the little bumps :)
	let bumps = [];

	let canvas;
	let context;

	canvas = document.getElementById('hero-canvas');
	context = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame;
	const fps = 35;

	window.addEventListener('resize', resizeCanvas, false);

	// Bump constants
	const BUMP_RADIUS = 4;
	const BUMP_WIDTH = BUMP_RADIUS * 2;
	const BUMP_MIN_RATIO = 1/32;
	const BUMP_MAX_RATIO = 1/8;
	let BUMP_MAX_HEIGHT = canvas.height * BUMP_MAX_RATIO;
	let BUMP_MIN_HEIGHT = canvas.height * BUMP_MIN_RATIO;

	// Bump constructor
	var Bump = function (x, y, height, radius, color) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.radius = radius;
		this.color = color

		this.direction = Math.random() < 0.5 ? -1 : 1;
	}

	// Takes care of drawing and updating the bumps
	Bump.prototype.update = function () {
		// Update the height by one unit
		this.height += this.direction;

		// Responsible of changing the direction of the bump if it reaches max or min height
		// canvas.height - this.height converts the position of the bump to actual height
		if (canvas.height - this.height >= BUMP_MAX_HEIGHT)
			this.direction = -(this.direction)
		else if (canvas.height - this.height < BUMP_MIN_HEIGHT)
			this.direction = -(this.direction)

		context.beginPath();
		// Move to initial position of the bump lower left corner
		context.moveTo(this.x, this.y);
		// Draw left vertical line
		context.lineTo(this.x, this.height);
		// center of arc (x), center of arc (y), radius, starting angle, ending angle
		context.arc(this.x + this.radius, this.height, this.radius, Math.PI, 0);
		// Draw right vertical line
		context.lineTo(this.x + BUMP_WIDTH, this.y);

		// Fill path
		context.fillStyle = this.color;
		context.fill();
	}

	function createBumps() {
		let currentXPos = 0;
		// Make bumps until x value is larger than the width
		while (currentXPos <= canvas.width) {
			// Get a random height between max and min values
			// subtract canvas.height to get the real canvas y value
			let randomHeight = canvas.height - (Math.floor(Math.random() * (BUMP_MAX_HEIGHT - BUMP_MIN_HEIGHT + 1)) + BUMP_MIN_HEIGHT);
			let bump = new Bump(currentXPos, canvas.height, randomHeight, BUMP_RADIUS, colors[colorCounter]);
			colorCounter++;
			if (colorCounter > colors.length - 1) {
				colorCounter = 0;
			}
			// update x position for next little bump
			currentXPos += BUMP_WIDTH;
			bumps.push(bump);
		}
	}

	function updateCanvas() {
		// clear canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < bumps.length; i++) {
			bumps[i].update();
		}
		// Manage fps
		setTimeout(function() {
			requestAnimationFrame(updateCanvas);
		}, 1000 / fps);
	}

	// Resize canvas based on the size of the window, this resets the canvas
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// Bump responsive height
		BUMP_MAX_HEIGHT = canvas.height * BUMP_MAX_RATIO;
		BUMP_MIN_HEIGHT = canvas.height * BUMP_MIN_RATIO;
		// Destroy the little bumps :(
		// TODO: dont kill the little bumps #bumplivesmatter
		bumps = [];
		// Spawn new little bumps
		createBumps();
	}

	createBumps();
	updateCanvas();
})();