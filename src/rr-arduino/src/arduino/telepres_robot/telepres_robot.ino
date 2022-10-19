// Motor connections
#define   SPEED_EN_1      3
#define   FORWARD_EN_1    2
#define   BACKWARD_EN_1   5

#define   SPEED_EN_2      9
#define   FORWARD_EN_2    6
#define   BACKWARD_EN_2   7


// Direction and speed constants
#define   FORWARD         1
#define   FORWARD_RIGHT   2
#define   RIGHT           3
#define   BACKWARD_RIGHT  4
#define   BACKWARD        5
#define   BACKWARD_LEFT   6
#define   LEFT            7
#define   FORWARD_LEFT    8
#define   STOP            0
#define   SPEED_CONSTANT  200
#define   CRUISE_SPEED    350
#define   MOVEMENT_DELAY  100

// global variables 
// int incomingByte = 0;

void motor(int dir, int speed);
void moveRobot(String directionStr);

void setup() {
   //put your setup code here, to run once:
   for (int i = 2; i <= 12; i++) {
     pinMode(i, OUTPUT);
   }
   Serial.begin(115200); //Starting serial communication

}

void loop() {
  int incomingByte = 0;
  
    if (Serial.available() > 0) {
      incomingByte = Serial.read(); // read the incoming byte:      
      Serial.println("-NEW REQUEST-");
      Serial.print(" I received:");
      Serial.println(incomingByte);
      moveRobot(incomingByte);
      Serial.println("-ROBOT MOVED-");
      // motor(FORWARD, CRUISE_SPEED);
      // delay(200); 
      // motor(STOP, 0);
      // delay(2000); 
    } 
}

void moveRobot(int incomingByte) {
  if ((incomingByte==119) || (incomingByte==87)) {
      motor(FORWARD, CRUISE_SPEED);
  } else  if ((incomingByte==115) || (incomingByte==83)) {
      motor(BACKWARD, CRUISE_SPEED);
  } else  if ((incomingByte==65) || (incomingByte==97)) {
      motor(LEFT, CRUISE_SPEED);
  } else  if ((incomingByte==68) || (incomingByte==100)) {
      motor(RIGHT, CRUISE_SPEED);
  }  
  delay(MOVEMENT_DELAY); 
  motor(STOP, 0);
}

void motor(int dir, int speed) {
  if (dir == FORWARD) {
    // Left motor forward with full speed
    digitalWrite(FORWARD_EN_1, HIGH);
    digitalWrite(BACKWARD_EN_1, LOW);
    analogWrite(SPEED_EN_1, speed);
    // Right motor forward with full speed
    digitalWrite(FORWARD_EN_2, HIGH);
    digitalWrite(BACKWARD_EN_2, LOW);
    analogWrite(SPEED_EN_2, speed);
  } else if (dir == BACKWARD) {
    // Left motor backward with full speed
    digitalWrite(FORWARD_EN_1, LOW);
    digitalWrite(BACKWARD_EN_1, HIGH);
    analogWrite(SPEED_EN_1, speed);
    // Right motor backward with full speed
    digitalWrite(FORWARD_EN_2, LOW);
    digitalWrite(BACKWARD_EN_2, HIGH);
    analogWrite(SPEED_EN_2, speed);    
  } else if (dir == FORWARD_RIGHT) {
    // Left motor forward with full speed
    digitalWrite(FORWARD_EN_1, HIGH);
    digitalWrite(BACKWARD_EN_1, LOW);
    analogWrite(SPEED_EN_1, speed);
    // Right motor forward with speed*SPEED_CONSTANT
    digitalWrite(FORWARD_EN_2, HIGH);
    digitalWrite(BACKWARD_EN_2, LOW);
    analogWrite(SPEED_EN_2, SPEED_CONSTANT);
  } else if (dir == RIGHT) {
    // Left motor forward with full speed
    digitalWrite(FORWARD_EN_1, HIGH);
    digitalWrite(BACKWARD_EN_1, LOW);
    analogWrite(SPEED_EN_1, speed);
    // Right motor backward with full speed
    digitalWrite(FORWARD_EN_2, LOW);
    digitalWrite(BACKWARD_EN_2, HIGH);
    analogWrite(SPEED_EN_2, speed);
  } else if (dir == BACKWARD_RIGHT) {
    // Left motor backward with full speed
    digitalWrite(FORWARD_EN_1, LOW);
    digitalWrite(BACKWARD_EN_1, HIGH);
    analogWrite(SPEED_EN_1, speed);
    // Right motor backward with SPEED_CONSTANT
    digitalWrite(FORWARD_EN_2, LOW);
    digitalWrite(BACKWARD_EN_2, HIGH);
    analogWrite(SPEED_EN_2, SPEED_CONSTANT);

  } else if (dir == BACKWARD_LEFT) {
    // Left motor backward with SPEED_CONSTANT
    digitalWrite(FORWARD_EN_1, LOW);
    digitalWrite(BACKWARD_EN_1, HIGH);
    analogWrite(SPEED_EN_1, SPEED_CONSTANT);
    // Right motor backward with full speed
    digitalWrite(FORWARD_EN_2, LOW);
    digitalWrite(BACKWARD_EN_2, HIGH);
    analogWrite(SPEED_EN_2, speed);
  } else if (dir == LEFT) {
    // Left motor forward with full speed
    digitalWrite(FORWARD_EN_1, LOW);
    digitalWrite(BACKWARD_EN_1, HIGH);
    analogWrite(SPEED_EN_1, speed);
    // Right motor backward with full speed
    digitalWrite(FORWARD_EN_2, HIGH);
    digitalWrite(BACKWARD_EN_2, LOW);
    analogWrite(SPEED_EN_2, speed);
  } else if (dir == FORWARD_LEFT) {
    // Left motor forward with SPEED_CONSTANT
    digitalWrite(FORWARD_EN_1, HIGH);
    digitalWrite(BACKWARD_EN_1, LOW);
    analogWrite(SPEED_EN_1, SPEED_CONSTANT);
    // Right motor forward with full speed
    digitalWrite(FORWARD_EN_2, HIGH);
    digitalWrite(BACKWARD_EN_2, LOW);
    analogWrite(SPEED_EN_2, speed);
  } else if (dir == STOP) {
    digitalWrite(FORWARD_EN_1, LOW);
    digitalWrite(BACKWARD_EN_1, LOW);
    
    digitalWrite(FORWARD_EN_2, LOW);
    digitalWrite(BACKWARD_EN_2, LOW);
    // Left motor stop
    analogWrite(SPEED_EN_1, 0);
    // Right motor stop
    analogWrite(SPEED_EN_2, 0);
  }
}