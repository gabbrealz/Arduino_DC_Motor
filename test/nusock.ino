#include <WiFiS3.h>
#include <NuSock.h>
#include "arduino_secrets.h"

// ===== CONFIG =====
char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
char wsServer[] = SECRET_WS_SERVER;
uint16_t wsPort = SECRET_WS_PORT;

// For Uno R4, we use the "Generic" pattern
WiFiClient wifi; 
NuSockClient ws;

unsigned long lastSendTime = 0;
const unsigned long sendInterval = 50; 
unsigned long lastReconnectAttempt = 0;
const unsigned long reconnectInterval = 3000;

void setup() {
  Serial.begin(115200);
  while (!Serial);

  // WiFi Connection
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");

  ws.begin(&wifi, wsServer, wsPort, "/");
  ws.connect();
}

void loop() {
  ws.loop();

  if (!ws.connected()) {
    autoReconnectWebSocket();
  } else if (millis() - lastSendTime >= sendInterval) {
    String payload = "{\"c\":\"Tester\",\"d\":\"" + String(random(0, 10)) + "\"}";
    ws.send(payload.c_str());

    lastSendTime = millis();
  }
}

void autoReconnectWebSocket() {
  if (millis() - lastReconnectAttempt >= reconnectInterval) {
    lastReconnectAttempt = millis();
    Serial.println("WebSocket disconnected. Reconnecting...");
    
    ws.connect();
    
    if(ws.connected()){
      String payload = "{\"r\":\"arduino\"}";
       ws.send(payload.c_str());
    }
  }
}