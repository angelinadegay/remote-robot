const Constants = require('../shared/constants');
const Player = require('./player');
const applyCollisions = require('./collisions');
const io = require ('socket.io-client');

class Game {
  constructor() {
    this.playerSockets = {};
    this.robotSockets = {};
    this.players = {};
    this.robots = {};
    this.bullets = [];
    this.raspberryAddress = "";
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    this.socket = io("ws://localhost:8765");
    setInterval(this.update.bind(this), 1000 / 60);
  }

  setRobotAdress(robotAdress) {
    if (robotAdress.length > 1) 
      this.raspberryAddress = robotAdress;
    else
      console.log('EMPTY ROBOT ADDRESSS!');
  }

  addPlayer(socket, username) {
    this.playerSockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE / 2;
    const y = Constants.MAP_SIZE / 2;
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  addRobot(socket, username) {
    this.robotSockets = {};
    this.robots = {};
    this.robotSockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE / 2;
    const y = Constants.MAP_SIZE / 2;
    this.robots[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socket) {
    delete this.playerSockets[socket.id];
    delete this.players[socket.id];
  }

  //OLEG
  handleMove(socket, dir, backforth) { 
    var dirstr = '';   
      if (this.players[socket.id]) {
        this.players[socket.id].setDirection(dir);
        this.players[socket.id].movement(backforth);
        console.log('emmitting the MOVE');
        Object.keys(this.robotSockets).forEach(playerID => {
          const robotSocket = this.robotSockets[playerID];
          const robot = this.robots[playerID];
          
          if (backforth > 0 )
            dirstr = Constants.ARDUINO_MOVEMENT_DIRECTIONS.FORWARD;
          else if (backforth < 0)
            dirstr = Constants.ARDUINO_MOVEMENT_DIRECTIONS.BACKWARD;
  
          robotSocket.emit('robot_move', dirstr);
          console.log('sent to ', playerID);
        });         
      }
    }

  handleInput(socket, dir) {
    var dirstr = '';
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
      console.log('emmitting the TURN');
      Object.keys(this.robotSockets).forEach(playerID => {
        const robotSocket = this.robotSockets[playerID];
        const robot = this.robots[playerID];
        
        if (dir > 0 && dir < Math.PI)
          dirstr = Constants.ARDUINO_MOVEMENT_DIRECTIONS.RIGHT;
        else if (dir > -Math.PI && dir < 0)
          dirstr = Constants.ARDUINO_MOVEMENT_DIRECTIONS.LEFT;

        robotSocket.emit('robot_move', dirstr);
        console.log('sent to ', playerID);
      });      
    }
  }

  update() {    
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each bullet

    // const bulletsToRemove = [];
    // this.bullets.forEach(bullet => {
    //   if (bullet.update(dt)) {
    //     // Destroy this bullet
    //     bulletsToRemove.push(bullet);
    //   }
    // });
    // this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

    // Update each player
//    Object.keys(this.sockets).forEach(playerID => {
  //    const player = this.players[playerID];
      // player.update(dt);
      // if (newBullet) {
      //   this.bullets.push(newBullet);
      // }
    //});

    // Apply collisions, give players score for hitting bullets
    // const destroyedBullets = applyCollisions(Object.values(this.players), this.bullets);
    // destroyedBullets.forEach(b => {
    //   if (this.players[b.parentID]) {
    //     this.players[b.parentID].onDealtDamage();
    //   }
    // });
    // this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    // Check if any players are dead
    // Object.keys(this.sockets).forEach(playerID => {
    //   const socket = this.sockets[playerID];
    //   const player = this.players[playerID];
    //   if (player.hp <= 0) {
    //     socket.emit(Constants.MSG_TYPES.GAME_OVER);
    //     this.removePlayer(socket);
    //   }
    // });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.playerSockets).forEach(playerID => {
        const socket = this.playerSockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
