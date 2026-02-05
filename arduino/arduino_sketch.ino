#include <Servo.h>
#include <ArduinoHTTPClient.h>
#include <WiFiS3.h>
#include "arduino_secrets.h"

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

char wsServer[] = SECRET_WS_SERVER;
int wsPort = SECRET_WS_PORT;

WiFiClient wifi;
WebsocketClient ws(wifi, wsServer, wsPort);

const int input4 = 9;
const int input3 = 10;
const int motorSpeed = 11;

const int servoPin = 6;
Servo swing;

const int red = 3;
const int orange = 4;
const int yellow = 5;
const int green = 7;
const int blue = 8;

int ledBrightness = 0;
int motorSpeedValue = 0;

void setup() {
  pinMode(input4, OUTPUT);
  pinMode(input3, OUTPUT);
  pinMode(motorSpeed, OUTPUT);
  
  digitalWrite(input3, HIGH);
  digitalWrite(input4, LOW);

  pinMode(red, OUTPUT);
  pinMode(orange, OUTPUT);
  pinMode(yellow, OUTPUT);
  pinMode(green, OUTPUT);
  pinMode(blue, OUTPUT);

  analogWrite(red, 0);
  analogWrite(orange, 0);
  analogWrite(yellow, 0);
  analogWrite(green, 0);
  analogWrite(blue, 0);
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

    if (ws.connected()) {
      ws.poll();

      if (ws.available()) {
        String msg = ws.readString();
        Serial.println("Received: " + msg);

        // Parse JSON message
        DynamicJsonDocument doc(1024);
        deserializeJson(doc, msg);

        if (doc.containsKey("ledBrightness")) {
          ledBrightness = doc["ledBrightness"];
        }

        if (doc.containsKey("motorSpeed")) {
          motorSpeedValue = doc["motorSpeed"];
        }
      }
    }

    // Update LED brightness
    analogWrite(red, ledBrightness);
    analogWrite(orange, ledBrightness);
    analogWrite(yellow, ledBrightness);
    analogWrite(green, ledBrightness);
    analogWrite(blue, ledBrightness);

    // Update motor speed
    analogWrite(motorSpeed, motorSpeedValue);
}

void autoReconnectWebSocket() {
  if (ws.connected() || millis() - lastWsAttempt <= wsReconnectInterval) return;

  Serial.println("WebSocket disconnected. Reconnecting...");
  ws.begin();
  ws.beginMessage(TYPE_TEXT);
  ws.print("{\"role\":\"arduino\"}");
  ws.endMessage();
  lastWsAttempt = millis();
}