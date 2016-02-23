"use strict";

(function () {

	let colors = ['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58'];
	let colorCounter = 0;

	// houses all the little bumps :)
	let bumps = null;

	let canvas = document.getElementById('hero-canvas');
	let context = canvas.getContext('2d');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	let fps = 35;

	window.addEventListener('resize', resizeCanvas, false);

	// Bump constants
	const BUMP_RADIUS = 4;
	const BUMP_WIDTH = BUMP_RADIUS * 2;
	const BUMP_MIN_RATIO = 1 / 32;
	const BUMP_MAX_RATIO = 1 / 8;

	let BUMP_MAX_HEIGHT = canvas.height * BUMP_MAX_RATIO;
	let BUMP_MIN_HEIGHT = canvas.height * BUMP_MIN_RATIO;

	// Bump constructor
	function Bump(left, bottom, radius, color) {
		this.left = left;
		// Bottom y value
		this.bottom = bottom;
		// Top y value
		this.top = randomTopCoordinate(bottom);
		this.radius = radius;
		this.color = color;

		this.direction = Math.random() < 0.5 ? -1 : 1;
	};

	// Takes care of drawing and updating the bumps
	Bump.prototype.update = function () {
		// Update the top by one unit
		this.top += this.direction;

		// Responsible of changing the direction of the bump if it reaches max or min top
		// canvas.height - this.top converts the position of the bump to actual height of the bump
		if (canvas.height - this.top >= BUMP_MAX_HEIGHT || canvas.height - this.top < BUMP_MIN_HEIGHT)
			this.direction = -this.direction;

		context.beginPath();
		// Move to initial position of the bump lower left corner
		context.moveTo(this.left, this.bottom);
		// Draw left vertical line
		context.lineTo(this.left, this.top);
		// center of arc (left), center of arc (bottom), radius, starting angle, ending angle
		context.arc(this.left + this.radius, this.top, this.radius, Math.PI, 0);
		// Draw right vertical line
		context.lineTo(this.left + BUMP_WIDTH, this.bottom);

		// Fill path
		context.fillStyle = this.color;
		context.fill();
	};

	// Takes a X coordinate starting position to create bumps which are pushed to arr
	function createBumps(currentLeftPos, arr) {
		arr = arr || [];
		// Make bumps until currentLeftPos value is larger than the width
		if(currentLeftPos < window.innerWidth){
			let bump = new Bump(currentLeftPos, canvas.height, BUMP_RADIUS, colors[colorCounter++]);
			colorCounter = (colorCounter > colors.length - 1) ? 0 : colorCounter;
			// update currentLeftPos position for next little bump
			currentLeftPos += BUMP_WIDTH;
			arr.push(bump);
			createBumps(currentLeftPos, arr);
		}
		return arr;
	}

	function updateCanvas() {
		// clear canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		bumps.forEach( (bump) =>{
			bump.update();
		});
		// Manage fps
		setTimeout( () => {
			requestAnimationFrame(updateCanvas);
		}, 1000 / fps);
	}

	// Resize canvas based on the size of the window
	function resizeCanvas() {
		// Only width has changed
		if(canvas.width != window.innerWidth && canvas.height == window.innerHeight){
			manageWidthChange();
		}
		// Only height has changed
		else if(canvas.height != window.innerHeight && canvas.width == window.innerWidth){
			manageHeightChange();
		}
		// Both changed
		else{
			manageWidthChange();
			manageHeightChange();
		}
	}

	function manageWidthChange(){
		if(window.innerWidth > canvas.width){
			// Create only the needed bumps starting at the left position of the last bump
			bumps = createBumps(bumps[bumps.length - 1].left + BUMP_WIDTH, bumps);
		}
		else{
			bumps = popBumps(bumps);
		}
		canvas.width = window.innerWidth;
	}

	function popBumps(arr){
		if(window.innerWidth + BUMP_WIDTH < arr.length * BUMP_WIDTH){
			arr = arr.slice(0, arr.length - 1);
			return popBumps(arr);
		}
		return arr;
	}

	function manageHeightChange(){
		BUMP_MAX_HEIGHT = window.innerHeight * BUMP_MAX_RATIO;
		BUMP_MIN_HEIGHT = window.innerHeight * BUMP_MIN_RATIO;
		bumps = recalculateHeight(bumps);
		canvas.height = window.innerHeight;
	}

	// Returns a new array of bumps with top values between the accepted range (BUMP_MIN_HEIGHT, BUMP_MAX_HEIGHT)
	function recalculateHeight(arr){
		return arr.map((bump) => {
			bump.bottom = window.innerHeight;
			// If bump top is less than the height for the bump max, recalculate value between the height range
			if(bump.top < bump.bottom - BUMP_MAX_HEIGHT){
				bump.top = randomTopCoordinate(bump.bottom);
			}
			else if(bump.top > bump.bottom - BUMP_MIN_HEIGHT){
				bump.top = randomTopCoordinate(bump.bottom);
			}
			return bump;
		});
	}

	function randomTopCoordinate(bottom){
		return bottom - (Math.floor(Math.random() * (BUMP_MAX_HEIGHT - BUMP_MIN_HEIGHT + 1)) + BUMP_MIN_HEIGHT)
	}

	// Create bumps starting at x = 0
	bumps = createBumps(0, []);
	updateCanvas();
})();