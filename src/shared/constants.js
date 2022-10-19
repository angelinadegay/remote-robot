module.exports = Object.freeze({
  PLAYER_RADIUS: 20,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 400,
  PLAYER_FIRE_COOLDOWN: 0.25,

  BULLET_RADIUS: 3,
  BULLET_SPEED: 800,
  BULLET_DAMAGE: 10,

  SCORE_BULLET_HIT: 20,
  SCORE_PER_SECOND: 1,

  MAP_SIZE: 3000,
  MSG_TYPES: {
    JOIN_DRIVER: 'join_driver',
    JOIN_ROBOT: 'join_robot',
    GAME_UPDATE: 'update',
    ROTATE: 'rotate',
    MOVE: 'move',
    INPUT: 'input',
    GAME_OVER: 'dead',
  },

  ARDUINO_MOVEMENT_DIRECTIONS: {
    FORWARD: 'W',
    BACKWARD: 'S',
    RIGHT: 'D',
    LEFT: 'A',
    FORWARD_RIGHT: 'E',
    FORWARD_LEFT: 'Q',
    BACKWARD_RIGHT: 'C',
    BACKWARD_LEFT: 'Z',
  }
});
