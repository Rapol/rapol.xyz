"use strict";
(function () {
	// Starting position of the mouse down action
	let position = {x: 0, y: 0};
	// Counter for iterating the array of letters
	let letterCounter = 0;
	let minFontSize = 3;
	let letters = "There should be no boundaries to human endeavor. We are all different. However bad life may seem, there is always something you can do, and succeed at. While there's life, there is hope.";
	let colors = ['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58'];
	let colorCounter = 0;

	// Drawing variables
	let canvas;
	let context;
	// Save current state
	let mouse = {x: 0, y: 0, down: false}


	canvas = document.getElementById('text-canvas');
	context = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	canvas.addEventListener('mousemove', mouseMove, false);

	canvas.addEventListener('dblclick', doubleClick, false);

	window.addEventListener('resize', resizeCanvas, false);

	// Resize canvas based on the size of the window, this resets the canvas
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	function mouseMove(event) {
		// Use this if no mouseDown functionality, that way the text starts exactly on the edge where the mouse enters
		if (position.x == 0 && position.y == 0) {
			position.x = event.layerX;
			position.y = event.layerY;
		}
		draw(event);
	}

	function draw(event) {
		// Get new mouse position
		// layerX and layerY get mouse position relative to the canvas and not the window
		mouse.x = event.layerX;
		mouse.y = event.layerY;
		// Get distance from the last know position in pixels
		let d = distance(position, mouse);
		// Rescale font size based on the distance travel, giving the illusion of acceleration
		let fontSize = minFontSize + d / 2;
		// Get next letter from the array
		let letter = letters[letterCounter];
		// return last letter font size
		let stepSize = textWidth(letter, fontSize);

		if (d > stepSize) {
			// If the distance travelled is larger than the size of the font size draw the next letter

			// Get the angle between the two lines
			let angle = Math.atan2(mouse.y - position.y, mouse.x - position.x);

			context.font = fontSize + "px Georgia";

			// Save the default settings of the canvas
			// Meaning that the grid will be in the default position not affected by translate
			context.save();
			// Move grid to the position of the next letter
			context.translate(position.x, position.y);
			context.rotate(angle);
			context.fillStyle = colors[colorCounter];
			// Draw text at the starting point of the grid
			context.fillText(letter, 0, 0);
			// Restore to original grid
			context.restore();

			// Increment counters and check arrays boundaries
			letterCounter++;
			if (letterCounter > letters.length - 1) {
				letterCounter = 0;
			}
			colorCounter++;
			if (colorCounter > colors.length - 1) {
				colorCounter = 0;
			}

			// Use distance travel and angle to calculate position of the next letter (grid)
			position.x = position.x + Math.cos(angle) * stepSize;
			position.y = position.y + Math.sin(angle) * stepSize;
		}
	}

	// Pythagoras
	function distance(pt, pt2) {
		let xs = pt2.x - pt.x;
		let ys = pt2.y - pt.y;
		return Math.sqrt((xs * xs) + (ys * ys));
	}

	// Double click to reset canvas
	function doubleClick(event) {
		canvas.width = canvas.width;
	}

	// Get the width in pixel of the string to be drawn
	function textWidth(string, size) {
		context.font = size + "px Georgia";

		if (context.fillText) {
			return context.measureText(string).width;
		} else if (context.mozDrawText) {
			return context.mozMeasureText(string);
		}

	};
})();

