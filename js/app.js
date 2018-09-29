'use strict';

// Enemies our player must avoid
class Enemy {
    constructor() {
      // Variables applied to each of our instances go here

      // Place enemy off the canvas (to the left) at random position
      this.x = -101 - Math.random() * (100);
      // at random row
      this.row = Math.floor(Math.random() * 3 + 1);;
      this.y = this.row * 83 - 23;
      // and randomly set its speed
      this.speed = Math.random() * 5 + 1;;

      // The image/sprite for our enemies, this uses
      // a helper we've provided to easily load images
      this.sprite = 'images/enemy-bug.png';
    }

    // Draw the enemy on the screen, required method for game
    render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.
      this.x = this.x + this.speed;

      // If enemy's off the canvas
      if(this.x >= 505) {
        // place it to the left of the canvas at random position
        this.x = -101 - Math.random() * 100;
        // at random row
        this.row = Math.floor(Math.random() * 3 + 1);
        this.y = this.row * 83 - 23;
        // and randomly change its speed
        this.speed = Math.random() * 5 + 1;
      }
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
const allEnemies = [];
for(let row = 1; row <= 3; row++) {
  allEnemies.push(new Enemy());
}

// Place the player object in a variable called player

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
