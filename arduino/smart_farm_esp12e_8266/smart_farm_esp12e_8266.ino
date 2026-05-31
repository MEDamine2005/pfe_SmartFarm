#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>

#define DHTPIN D4
#define DHTTYPE DHT22

#define SOIL_PIN A0
#define LDR_PIN D1
#define WATER_PIN D2
#define RELAY_PIN D5

// --- Configuration reseau / API (a adapter) ---
const char* ssid = "mart_farm";
const char* password = "12345678";

// IP locale du PC qui execute: php artisan serve (pas 127.0.0.1 depuis l'ESP)
const char* serverUrl = "http://192.168.43.205:8000/api/iot/readings";
const char* deviceId = "ESP-12E-8266";
const char* iotKey = "smart-farm-iot-2026";

const unsigned long SEND_INTERVAL_MS = 15000;

DHT dht(DHTPIN, DHTTYPE);

bool pumpState = false;
unsigned long lastSendAt = 0;

void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    return;
  }

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("Connexion WiFi...");

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 20000) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi connecte");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("WiFi echoue");
  }
}

void setPump(bool on) {
  pumpState = on;
  // Relais actif LOW (module relais classique)
  digitalWrite(RELAY_PIN, on ? LOW : HIGH);
}

void setup() {
  Serial.begin(115200);
  pinMode(LDR_PIN, INPUT);
  pinMode(WATER_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  setPump(false);
  dht.begin();
  connectWiFi();
}

void loop() {
  connectWiFi();

  if (WiFi.status() != WL_CONNECTED) {
    delay(2000);
    return;
  }

  if (millis() - lastSendAt < SEND_INTERVAL_MS) {
    delay(200);
    return;
  }

  lastSendAt = millis();

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Erreur lecture DHT22");
    return;
  }

  int soilRaw = analogRead(SOIL_PIN);
  int ldrValue = digitalRead(LDR_PIN);
  int waterValue = digitalRead(WATER_PIN);

  // Humidite sol: 0% sec -> 100% humide (calibrer selon votre sonde)
  int soilPercent = constrain(map(soilRaw, 1023, 300, 0, 100), 0, 100);

  // Luminosite en % (LDR digital: LOW = beaucoup de lumiere avec pull-up)
  int lightPercent = (ldrValue == LOW) ? 90 : 15;

  // Niveau eau en % (HIGH = reservoir OK sur capteur flottant classique)
  int waterPercent = (waterValue == HIGH) ? 85 : 12;

  WiFiClient client;
  HTTPClient http;

  if (!http.begin(client, serverUrl)) {
    Serial.println("URL API invalide");
    return;
  }

  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-IOT-KEY", iotKey);

  String jsonData = "{";
  jsonData += "\"device_id\":\"" + String(deviceId) + "\",";
  jsonData += "\"temperature\":" + String(temperature, 1) + ",";
  jsonData += "\"humidite_air\":" + String(humidity, 1) + ",";
  jsonData += "\"humidite_sol\":" + String(soilPercent) + ",";
  jsonData += "\"luminosite\":" + String(lightPercent) + ",";
  jsonData += "\"niveau_eau\":" + String(waterPercent);
  jsonData += "}";

  int httpResponseCode = http.POST(jsonData);
  Serial.println(jsonData);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(response);

    if (response.indexOf("\"pompe_etat\":true") >= 0 || response.indexOf("\"pompe_etat\": true") >= 0) {
      setPump(true);
    } else {
      setPump(false);
    }
  } else {
    Serial.print("Erreur HTTP: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}
