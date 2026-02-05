#include <Servo.h>
#include <ArduinoHttpClient.h>
#include <WiFiS3.h>
#include <ArduinoJson.h>
#include "arduino_secrets.h"

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

char wsServer[] = SECRET_WS_SERVER;
int wsPort = SECRET_WS_PORT;

WiFiClient wifi;
WebSocketClient ws(wifi, wsServer, wsPort);

unsigned long lastWsAttempt = 0;
const unsigned long wsReconnectInterval = 3000;

const int input4 = 12;
const int input3 = 13;
const int motorSpeed = 11;

const int servoPin = 6;
Servo swing;

#define COMP_YELLOW1 "YELLOW1"
#define COMP_YELLOW2 "YELLOW2"
#define COMP_RED     "RED"
#define COMP_GREEN1  "GREEN1"
#define COMP_GREEN2  "GREEN2"
#define COMP_FAN     "FAN"
#define COMP_SWING   "SWING"

const int green1 = 3;
const int yellow1 = 9;
const int red = 10;
const int yellow2 = 7;
const int green2 = 5;

int ledGreen1 = 0;
int ledYellow1 = 0;
int ledRed = 0;
int ledYellow2 = 0;
int ledGreen2 = 0;

#define MAX_FAN_SPEED 230

int fanSpeed = 0;

bool servoSwing = false;
int servoAngle = 90;
int servoDirection = 1;
unsigned long lastServoUpdate = 0;
const int servoDelay = 20;

void setup() {
  pinMode(input4, OUTPUT);
  pinMode(input3, OUTPUT);
  pinMode(motorSpeed, OUTPUT);
  
  digitalWrite(input3, HIGH);
  digitalWrite(input4, LOW);

  pinMode(green1, OUTPUT);
  pinMode(yellow1, OUTPUT);
  pinMode(red, OUTPUT);
  pinMode(yellow2, OUTPUT);
  pinMode(green2, OUTPUT);

  analogWrite(green1, 0);
  analogWrite(yellow1, 0);
  analogWrite(red, 0);
  analogWrite(yellow2, 0);
  analogWrite(green2, 0);
  analogWrite(motorSpeed, 0);

  swing.attach(servoPin);

  Serial.begin(115200);
  while (!Serial);

  // Connect to WiFi
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  // Connect to WebSocket
  ws.begin();
  ws.beginMessage(TYPE_TEXT);
  ws.print("{\"role\":\"arduino\"}");
  ws.endMessage();
}

void loop() {
  autoReconnectWebSocket();

  if (ws.connected() && ws.parseMessage() > 0) {
    String msg = ws.readString();
    Serial.println("Received: " + msg);

    DynamicJsonDocument doc(256);
    DeserializationError err = deserializeJson(doc, msg);

    if (!err) {
      const char* component = doc["component"];
      if (!component) return;

      int value = doc["value"];

      // ===== LED CONTROL =====
      if (strcmp(component, COMP_YELLOW1) == 0) {
        ledYellow1 = constrain(value, 0, 255);
      }
      else if (strcmp(component, COMP_YELLOW2) == 0) {
        ledYellow2 = constrain(value, 0, 255);
      }
      else if (strcmp(component, COMP_RED) == 0) {
        ledRed = constrain(value, 0, 255);
      }
      else if (strcmp(component, COMP_GREEN1) == 0) {
        ledGreen1 = constrain(value, 0, 255);
      }
      else if (strcmp(component, COMP_GREEN2) == 0) {
        ledGreen2 = constrain(value, 0, 255);
      }

      // ===== FAN MOTOR =====
      else if (strcmp(component, COMP_FAN) == 0) {
        fanSpeed = constrain(value, 0, MAX_FAN_SPEED);
      }

      // ===== SERVO SWING =====
      else if (strcmp(component, COMP_SWING) == 0) {
        servoSwing = value;
      }
    }
  }

    // ===== APPLY OUTPUTS =====
    analogWrite(yellow1, ledYellow1);
    analogWrite(yellow2, ledYellow2);
    analogWrite(red,     ledRed);
    analogWrite(green1,  ledGreen1);
    analogWrite(green2,  ledGreen2);
    analogWrite(motorSpeed, fanSpeed);

  // ===== SERVO FAN-LIKE SWING =====
  if (servoSwing) {
    if (millis() - lastServoUpdate >= servoDelay) {
      servoAngle += servoDirection;

      if (servoAngle >= 120 || servoAngle <= 60) {
        servoDirection *= -1;
      }

      swing.write(servoAngle);
      lastServoUpdate = millis();
    }
  }
}

void autoReconnectWebSocket() {
  if (ws.connected() || millis() - lastWsAttempt <= wsReconnectInterval)
  return;

  Serial.println("WebSocket disconnected. Reconnecting...");
  ws.begin();
  ws.beginMessage(TYPE_TEXT);
  ws.print("{\"role\":\"arduino\"}");
  ws.endMessage();
  lastWsAttempt = millis();
}