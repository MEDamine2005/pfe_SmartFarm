/*
  Smart Farm - Arduino UNO R3 + ESP8266 AT firmware

  Materiel:
  - Arduino UNO R3
  - ESP8266 module avec firmware AT
  - DHT22 temperature/humidite sur D2
  - Relais 5V pompe sur D7
  - Capteur humidite sol sur A0
  - LDR sur A1
  - Capteur niveau eau sur A2

  Bibliotheques Arduino IDE:
  - DHT sensor library by Adafruit
  - Adafruit Unified Sensor
*/

#include <SoftwareSerial.h>
#include <DHT.h>

#define DHT_PIN 2
#define DHT_TYPE DHT22
#define RELAY_PIN 7
#define ESP_RX_PIN 10
#define ESP_TX_PIN 11
#define SOIL_PIN A0
#define LDR_PIN A1
#define WATER_LEVEL_PIN A2

const char WIFI_SSID[] = "YOUR_WIFI_NAME";
const char WIFI_PASS[] = "YOUR_WIFI_PASSWORD";

// Remplace par l'adresse IP de ton PC sur le meme WiFi: ipconfig -> IPv4 Address.
const char SERVER_HOST[] = "192.168.1.10";
const int SERVER_PORT = 8000;
const char IOT_KEY[] = "smart-farm-iot-2026";

const char ARDUINO_ID[] = "ARD-001";
const char ESP8266_ID[] = "ESP-001";

// Change a false si ton module relais s'active avec HIGH.
const bool RELAY_ACTIVE_LOW = true;

// Calibrage: ajuste ces valeurs apres test avec Serial Monitor.
const int SOIL_DRY = 800;
const int SOIL_WET = 300;
const int WATER_EMPTY = 120;
const int WATER_FULL = 650;

SoftwareSerial esp(ESP_RX_PIN, ESP_TX_PIN);
DHT dht(DHT_PIN, DHT_TYPE);

bool pompeEtat = false;
unsigned long lastSend = 0;
const unsigned long SEND_INTERVAL_MS = 15000;

void setup() {
  Serial.begin(9600);
  esp.begin(9600);
  dht.begin();

  pinMode(RELAY_PIN, OUTPUT);
  setPompe(false);

  delay(2000);
  setupEsp8266();
}

void loop() {
  if (millis() - lastSend >= SEND_INTERVAL_MS) {
    lastSend = millis();
    sendReadings();
    getCommand();
  }
}

void setupEsp8266() {
  sendAT("AT", 2000);
  sendAT("AT+CWMODE=1", 2000);

  String joinCmd = "AT+CWJAP=\"";
  joinCmd += WIFI_SSID;
  joinCmd += "\",\"";
  joinCmd += WIFI_PASS;
  joinCmd += "\"";
  sendAT(joinCmd, 12000);
}

void sendReadings() {
  float temperature = dht.readTemperature();
  float humiditeAir = dht.readHumidity();

  if (isnan(temperature) || isnan(humiditeAir)) {
    Serial.println("Erreur lecture DHT22");
    return;
  }

  int soilRaw = analogRead(SOIL_PIN);
  int ldrRaw = analogRead(LDR_PIN);
  int waterRaw = analogRead(WATER_LEVEL_PIN);

  int humiditeSol = constrain(map(soilRaw, SOIL_DRY, SOIL_WET, 0, 100), 0, 100);
  int luminosite = constrain(map(ldrRaw, 0, 1023, 0, 100), 0, 100);
  int niveauEau = constrain(map(waterRaw, WATER_EMPTY, WATER_FULL, 0, 100), 0, 100);

  String body = "{";
  body += "\"arduino_id\":\"" + String(ARDUINO_ID) + "\",";
  body += "\"esp8266_id\":\"" + String(ESP8266_ID) + "\",";
  body += "\"temperature\":" + String(temperature, 1) + ",";
  body += "\"humidite_air\":" + String(humiditeAir, 1) + ",";
  body += "\"humidite_sol\":" + String(humiditeSol) + ",";
  body += "\"luminosite\":" + String(luminosite) + ",";
  body += "\"niveau_eau\":" + String(niveauEau) + ",";
  body += "\"pompe_etat\":";
  body += pompeEtat ? "true" : "false";
  body += "}";

  String response = httpRequest("POST", "/api/iot/readings", body);
  applyPompeFromResponse(response);

  Serial.println("POST readings:");
  Serial.println(body);
  Serial.println(response);
}

void getCommand() {
  String response = httpRequest("GET", "/api/iot/command", "");
  applyPompeFromResponse(response);

  Serial.println("GET command:");
  Serial.println(response);
}

String httpRequest(String method, String path, String body) {
  sendAT("AT+CIPSTART=\"TCP\",\"" + String(SERVER_HOST) + "\"," + String(SERVER_PORT), 5000);

  String request = method + " " + path + " HTTP/1.1\r\n";
  request += "Host: " + String(SERVER_HOST) + "\r\n";
  request += "Connection: close\r\n";
  request += "Accept: application/json\r\n";
  request += "X-IOT-KEY: " + String(IOT_KEY) + "\r\n";

  if (method == "POST") {
    request += "Content-Type: application/json\r\n";
    request += "Content-Length: " + String(body.length()) + "\r\n";
  }

  request += "\r\n";
  request += body;

  esp.print("AT+CIPSEND=");
  esp.println(request.length());
  delay(500);

  if (esp.find(">")) {
    esp.print(request);
  }

  String response = readEsp(7000);
  sendAT("AT+CIPCLOSE", 1000);
  return response;
}

void applyPompeFromResponse(String response) {
  if (response.indexOf("\"pompe_etat\":true") >= 0 || response.indexOf("\"pompe_etat\":1") >= 0) {
    setPompe(true);
  }

  if (response.indexOf("\"pompe_etat\":false") >= 0 || response.indexOf("\"pompe_etat\":0") >= 0) {
    setPompe(false);
  }
}

void setPompe(bool active) {
  pompeEtat = active;

  if (RELAY_ACTIVE_LOW) {
    digitalWrite(RELAY_PIN, active ? LOW : HIGH);
  } else {
    digitalWrite(RELAY_PIN, active ? HIGH : LOW);
  }
}

void sendAT(String command, unsigned long timeoutMs) {
  esp.println(command);
  String response = readEsp(timeoutMs);
  Serial.println(command);
  Serial.println(response);
}

String readEsp(unsigned long timeoutMs) {
  String response = "";
  unsigned long start = millis();

  while (millis() - start < timeoutMs) {
    while (esp.available()) {
      response += char(esp.read());
    }
  }

  return response;
}
