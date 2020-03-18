#include <Servo.h>

int TRIG = 13;
int ECHO = 12;
int SERVO = 9;
double v = 0.0172;

Servo servo;

void setup() {
  Serial.begin(9600);
  servo.attach(SERVO);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
}

void dist(int i) {
  servo.write(i);
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(5);
  digitalWrite(TRIG, LOW);
  long t = pulseIn(ECHO, HIGH);
  double s = v * t;
  Serial.print(round(s));
  Serial.print(",");
  Serial.print(i);
  Serial.print(".");
}

void loop() {
  for (int i = 0; i < 180; ++i) {
    dist(i);
  }
  for (int i = 180; i >= 0; --i) {
    dist(i);
  }
}
