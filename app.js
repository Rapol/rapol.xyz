(function() {
  // Starting position of the mouse down action
  var position = {x: 0, y: 0};
  // Counter for iterating the array of letters
  var counter = 0;
  var minFontSize = 3;
  var letters = "There should be no boundaries to human endeavor. We are all different. However bad life may seem, there is always something you can do, and succeed at. While there's life, there is hope.";
  var colors = ['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58'];
  var colorCounter = 0;

  // Drawing variables
  var canvas;
  var context;
  // Save current state
  var mouse = {x: 0, y: 0, down: false}


  canvas = document.getElementById( 'canvas' );
  context = canvas.getContext( '2d' );
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  canvas.addEventListener('mousemove', mouseMove, false);
  // canvas.addEventListener('mousedown', mouseDown, false);
  // canvas.addEventListener('mouseup',   mouseUp,   false);
  // canvas.addEventListener('mouseout',  mouseUp,  false);  
  canvas.addEventListener('dblclick', doubleClick, false);
  
  window.addEventListener('resize', resizeCanvas, false);
  
  // Resize canvas based on the size of the window, this resets the canvas
  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function mouseMove ( event ){
      // Use this if no mouseDown functionality, that way the text starts exactly on the edge where the mouse enters
      if(position.x == 0 && position.y ==0){
        position.x = event.pageX;
        position.y = event.pageY;
      }
      //if(mouse.down){
      draw();
      //}
  }

  function draw() {
    // Get new mouse position
    mouse.x = event.pageX;
    mouse.y = event.pageY;
    // Get distance from the last know position in pixels
    var d = distance( position, mouse );
    // Rescale font size based on the distance travel, giving the illusion of acceleration
    var fontSize = minFontSize + d/2;
    // Get next letter from the array
    var letter = letters[counter];
    // return last letter font size
    var stepSize = textWidth( letter, fontSize );

    if (d > stepSize) {
        // If the distance travelled is larger than the size of the font size draw the next letter

        // Get the angle between the two lines
        var angle = Math.atan2(mouse.y-position.y, mouse.x-position.x);

        context.font = fontSize + "px Georgia";

        // Save the default settings of the canvas
        // Meaning that the grid will be in the default position not affected by translate
        context.save();
        // Move grid to the position of the next letter
        context.translate( position.x, position.y);
        context.rotate( angle );
        context.fillStyle = colors[colorCounter];
        // Draw text at the starting point of the grid
        context.fillText(letter,0,0);
        // Restore to original grid
        context.restore();

        // Increment counters and check arrays boundaries
        counter++;
        if (counter > letters.length-1) {
            counter = 0;
        }
        colorCounter++;
        if(colorCounter > colors.length-1){
          colorCounter = 0;
        }

        // Use distance travel and angle to calculate position of the next letter (grid)
        position.x = position.x + Math.cos(angle) * stepSize;
        position.y = position.y + Math.sin(angle) * stepSize;
    }
  }

  // Pythagoras
  function distance( pt, pt2 ){
    var xs = 0;
    var ys = 0;
    xs = pt2.x - pt.x;
    ys = pt2.y - pt.y;
    return Math.sqrt( (xs * xs) + (ys * ys) );
  }

  // function mouseDown( event ){
  //   mouse.down = true;
  //   // Get starting point of the mouse down
  //   position.x = event.pageX;
  //   position.y = event.pageY;
  // }

  // function mouseUp( event ){
  //   mouse.down = false;
  // }

  // Double click to reset canvas
  function doubleClick( event ) {
    canvas.width = canvas.width; 
  }

  // Get the width in pixel of the string to be drawn
  function textWidth( string, size ) {
    context.font = size + "px Georgia";

    if ( context.fillText ) {
      return context.measureText( string ).width;
    } else if ( context.mozDrawText) {
      return context.mozMeasureText( string );
    }

  };

}());