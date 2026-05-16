#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>

#define DHTPIN D4
#define DHTTYPE DHT22

#define SOIL_PIN A0
#define LDR_PIN D1
#define WATER_PIN D2
#define RELAY_PIN D5

const char* ssid = "mart_farm";
const char* password = "12345678";

const char* serverName = "http://192.168.43.205:8000/api/iot/readings";

DHT dht(DHTPIN, DHTTYPE);

bool pumpState = false;

void setup() {
  Serial.begin(115200);

  pinMode(LDR_PIN, INPUT);
  pinMode(WATER_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);

  digitalWrite(RELAY_PIN, HIGH);

  dht.begin();
  WiFi.begin(ssid, password);

  Serial.println("Connexion WiFi...");

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi Connecte !");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Erreur lecture DHT22");
      delay(15000);
      return;
    }

    int soilValue = analogRead(SOIL_PIN);
    int ldrValue = digitalRead(LDR_PIN);
    int waterValue = digitalRead(WATER_PIN);
    int soilPercent = constrain(map(soilValue, 1023, 300, 0, 100), 0, 100);

    http.begin(client, serverName);
    http.addHeader("Content-Type", "application/json");

    String jsonData = "{";
    jsonData += "\"temperature\":" + String(temperature) + ",";
    jsonData += "\"humidite_air\":" + String(humidity) + ",";
    jsonData += "\"humidite_sol\":" + String(soilPercent) + ",";
    jsonData += "\"luminosite\":" + String(ldrValue) + ",";
    jsonData += "\"niveau_eau\":" + String(waterValue);
    jsonData += "}";

    int httpResponseCode = http.POST(jsonData);

    Serial.println(jsonData);

    if (httpResponseCode > 0) {
      String response = http.getString();

      Serial.println(response);

      if (response.indexOf("\"pompe_etat\":true") >= 0) {
        digitalWrite(RELAY_PIN, LOW);
        pumpState = true;
      } else {
        digitalWrite(RELAY_PIN, HIGH);
        pumpState = false;
      }
    } else {
      Serial.print("Erreur HTTP: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }

  delay(15000);
}

