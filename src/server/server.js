const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');

const Constants = require('../shared/constants');
const Game = require('./game');
const webpackConfig = require('../../webpack.dev.js');
//const robots = require('./robotsrouter.js');

// Setup an Express server
const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
  // Setup Webpack for development
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
} else {
  // Static serve the dist/ folder in production
  app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.MSG_TYPES.JOIN_DRIVER, joinDriver);
  socket.on(Constants.MSG_TYPES.JOIN_ROBOT, joinRobot);
  socket.on(Constants.MSG_TYPES.INPUT, handleInput);
  socket.on(Constants.MSG_TYPES.MOVE, handleMove);
  socket.on(Constants.MSG_TYPES.ROTATE, handleInput);
  socket.on(Constants.MSG_TYPES.ROTATE, handleInput);
  socket.on('disconnect', onDisconnect);
});

// Setup the Game
const game = new Game();

//app.use('/rest', robots);
app.post("/rest/registerrobot/:address", (req, res) => {
  console.log('Registration call received. Params = ', req.params);
  if(!req.params.address)
    {    
      res.status(400);
      res.json({message: "Bad Request: Parameter address not found"});
      console.log('Bad Request: Parameter address not found');
    } else {
      game.setRobotAdress(req.params.address)
      console.log('Address received: ', req.params.address);
      res.status(201);
      res.json({message: "A new robot URL assigned"});      
    }
 });

function joinDriver(username) {
  console.log('username:', username);
  game.addPlayer(this, username);
}

function joinRobot(username) {
  console.log('username:', username);
  game.addRobot(this, username);
}

function handleInput(dir) {
  console.log('handleImput call, direction = ', dir);
  game.handleInput(this, dir);
}

function handleMove(dir, backforth) {
  console.log('direction = ', dir);
  console.log('backforth = ', backforth);
  game.handleMove(this, dir, backforth);
}

function onDisconnect() {
  game.removePlayer(this);
}
