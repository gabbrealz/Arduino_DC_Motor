#include <stdint.h>
#include <WiFiS3.h>
#include <ArduinoHttpClient.h>
#include "arduino_secrets.h"

// ===== WIFI & WEBSOCKET CONFIG =====
char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

char wsServer[] = SECRET_WS_SERVER;
int wsPort = SECRET_WS_PORT;

WiFiClient wifi;
WebSocketClient ws(wifi, wsServer, wsPort);

unsigned long lastWsAttempt = 0;
const unsigned long wsReconnectInterval = 3000;

void setup() {
  Serial.begin(115200);
  while (!Serial);

  // ===== CONNECT TO WIFI =====
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  // ===== CONNECT TO WEBSOCKET =====
  Serial.println("Connecting to WebSocket...");
  ws.begin();
  ws.beginMessage(TYPE_TEXT);
  ws.print("{\"r\":\"arduino\"}");
  ws.endMessage();
}


void loop() {
  autoReconnectWebSocket();

  sendData();
  delay(30);
}


void sendData() {
  if (!ws.connected()) return;

  ws.beginMessage(TYPE_TEXT);
  ws.print("{\"c\":\"Tester\",\"d\":\"");
  ws.print(random(0,10));
  ws.print("\"}");
  ws.endMessage();
}

void autoReconnectWebSocket() {
  if (ws.connected() || millis() - lastWsAttempt <= wsReconnectInterval) return;

  Serial.println("WebSocket disconnected. Reconnecting...");
  ws.begin();
  ws.beginMessage(TYPE_TEXT);
  ws.print("{\"r\":\"arduino\"}");
  ws.endMessage();
  lastWsAttempt = millis();
}