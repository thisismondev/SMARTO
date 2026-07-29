#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Konfigurasi WiFi dan API
const char* WIFI_SSID = "SMARTO";
const char* WIFI_PASSWORD = "@AdminSmarto";
const char* API_BASE_URL = "https://smart-inokulasi.com";
const char* KODE_NODE = "KN-21626";

const unsigned long SEND_INTERVAL_MS = 20000;
const unsigned long WIFI_TIMEOUT_MS = 20000;
const unsigned long MODBUS_TIMEOUT_MS = 1200;
const unsigned long HTTP_TIMEOUT_MS = 7000;

// Konfigurasi pin
#define RS485_RX_PIN 16
#define RS485_TX_PIN 17
#define RS485_RE_PIN 4
#define RS485_DE_PIN 5

#define LCD_SDA_PIN 21
#define LCD_SCL_PIN 22
#define LCD_ADDRESS 0x27
#define LCD_COLUMNS 20
#define LCD_ROWS 4

LiquidCrystal_I2C lcd(LCD_ADDRESS, LCD_COLUMNS, LCD_ROWS);

// Register sensor RS485 7-in-1
#define DEVICE_ADDRESS 0x01
#define READ_HOLDING_REGISTERS 0x03
#define MOISTURE_REGISTER      0x0000
#define TEMPERATURE_REGISTER   0x0001
#define CONDUCTIVITY_REGISTER  0x0002
#define PH_REGISTER            0x0003
#define NITROGEN_REGISTER      0x0004
#define PHOSPHORUS_REGISTER    0x0005
#define POTASSIUM_REGISTER     0x0006

const uint16_t MODBUS_ERROR = 0xFFFF;

// Batas logis sensor
const float PH_MIN = 0.0;
const float PH_MAX = 14.0;
const float KELEMBAPAN_MIN = 0.0;
const float KELEMBAPAN_MAX = 100.0;
const float SUHU_MIN = 0.0;
const float SUHU_MAX = 60.0;
const uint16_t NITROGEN_MIN = 0;
const uint16_t NITROGEN_MAX = 2000;
const uint16_t EC_MIN = 0;
const uint16_t EC_MAX = 20000;
const uint16_t PHOSPHORUS_MIN = 0;
const uint16_t PHOSPHORUS_MAX = 2000;
const uint16_t POTASSIUM_MIN = 0;
const uint16_t POTASSIUM_MAX = 2000;

unsigned long lastSendTime = 0;
String lastHttpStatus = "WAIT";

struct SensorData {
  float kelembapan;
  float suhu;
  float ph;
  uint16_t ec;
  uint16_t nitrogen;
  uint16_t phosphorus;
  uint16_t potassium;
  bool validKelembapan;
  bool validSuhu;
  bool validPh;
  bool validEc;
  bool validNitrogen;
  bool validPhosphorus;
  bool validPotassium;
};

// Validasi rentang nilai desimal
bool inRangeFloat(float value, float minValue, float maxValue) {
  return value >= minValue && value <= maxValue;
}

// Validasi rentang nilai bilangan bulat
bool inRangeUInt(uint16_t value, uint16_t minValue, uint16_t maxValue) {
  return value >= minValue && value <= maxValue;
}

// Validasi 4 indikator utama sebelum dikirim
bool isMainDataValid(const SensorData& data) {
  return data.validPh && data.validKelembapan && data.validSuhu && data.validNitrogen;
}

// Menyesuaikan teks dengan lebar LCD
String fitLCD(const String& text) {
  String out = text.substring(0, min((int)text.length(), LCD_COLUMNS));
  while (out.length() < LCD_COLUMNS) out += " ";
  return out;
}

// Menulis satu baris LCD
void printLine(uint8_t row, const String& text) {
  lcd.setCursor(0, row);
  lcd.print(fitLCD(text));
}

// Format angka desimal atau error
String valueFloat(bool valid, float value, unsigned int decimalPlaces) {
  if (!valid) return "Err";
  return String(value, decimalPlaces);
}

// Format angka bulat atau error
String valueInt(bool valid, uint16_t value) {
  return valid ? String(value) : "Err";
}

// Tampilan awal LCD
void showBootScreen() {
  lcd.clear();
  printLine(0, "SMARTO IoT ESP32");
  printLine(1, "RS485 Soil Sensor");
  printLine(2, String("Node ") + KODE_NODE);
  printLine(3, "Starting...");
}

// Tampilan data sensor di LCD
void showSensorOnLCD(const SensorData& data) {
  String row0 = String("NODE ") + KODE_NODE;
  String row1 = "pH " + valueFloat(data.validPh, data.ph, 2) + " | T " + valueFloat(data.validSuhu, data.suhu, 1) + "C";
  String row2 = "H " + valueFloat(data.validKelembapan, data.kelembapan, 1) + "% | N " + valueInt(data.validNitrogen, data.nitrogen);
  String row3 = (WiFi.status() == WL_CONNECTED) ? "WiFi OK | API " : "WiFi OFF| API ";
  row3 += lastHttpStatus;

  if (!isMainDataValid(data)) row3 = "DATA ERR | API SENS";

  printLine(0, row0);
  printLine(1, row1);
  printLine(2, row2);
  printLine(3, row3);
}

// Koneksi awal WiFi
void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting WiFi");
  printLine(3, "Connecting WiFi...");

  unsigned long startAttempt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startAttempt < WIFI_TIMEOUT_MS) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("WiFi connected. IP: ");
    Serial.println(WiFi.localIP());
    printLine(3, "WiFi connected");
  } else {
    Serial.println("WiFi failed");
    printLine(3, "WiFi failed");
  }
}

// Koneksi ulang WiFi jika terputus
void ensureWiFiConnected() {
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.disconnect();
    delay(500);
    connectWiFi();
  }
}

// Perhitungan CRC Modbus
uint16_t calculateCRC(uint8_t* data, uint8_t length) {
  uint16_t crc = 0xFFFF;

  for (uint8_t pos = 0; pos < length; pos++) {
    crc ^= (uint16_t)data[pos];
    for (uint8_t i = 0; i < 8; i++) {
      if (crc & 0x0001) {
        crc >>= 1;
        crc ^= 0xA001;
      } else {
        crc >>= 1;
      }
    }
  }

  return crc;
}

// Membuat frame request Modbus
void createRequestFrame(uint8_t* frame, uint16_t registerAddress) {
  frame[0] = DEVICE_ADDRESS;
  frame[1] = READ_HOLDING_REGISTERS;
  frame[2] = (registerAddress >> 8) & 0xFF;
  frame[3] = registerAddress & 0xFF;
  frame[4] = 0x00;
  frame[5] = 0x01;

  uint16_t crc = calculateCRC(frame, 6);
  frame[6] = crc & 0xFF;
  frame[7] = (crc >> 8) & 0xFF;
}

// Membaca satu register sensor RS485
uint16_t readRegister(uint16_t registerAddress) {
  uint8_t requestFrame[8];
  uint8_t responseFrame[7];

  createRequestFrame(requestFrame, registerAddress);

  while (Serial2.available()) Serial2.read();

  digitalWrite(RS485_DE_PIN, HIGH);
  digitalWrite(RS485_RE_PIN, HIGH);
  delay(5);

  Serial2.write(requestFrame, sizeof(requestFrame));
  Serial2.flush();

  digitalWrite(RS485_DE_PIN, LOW);
  digitalWrite(RS485_RE_PIN, LOW);

  unsigned long startTime = millis();
  uint8_t index = 0;

  while (millis() - startTime < MODBUS_TIMEOUT_MS && index < sizeof(responseFrame)) {
    if (Serial2.available()) responseFrame[index++] = Serial2.read();
  }

  if (index != 7) return MODBUS_ERROR;
  if (responseFrame[0] != DEVICE_ADDRESS || responseFrame[1] != READ_HOLDING_REGISTERS) return MODBUS_ERROR;

  uint16_t receivedCRC = ((uint16_t)responseFrame[6] << 8) | responseFrame[5];
  uint16_t calculatedCRC = calculateCRC(responseFrame, 5);

  if (receivedCRC != calculatedCRC) return MODBUS_ERROR;

  return ((uint16_t)responseFrame[3] << 8) | responseFrame[4];
}

// Membaca seluruh indikator sensor tanah
SensorData readSoilSensor() {
  SensorData data;

  uint16_t moistureRaw = readRegister(MOISTURE_REGISTER);
  delay(100);
  uint16_t temperatureRaw = readRegister(TEMPERATURE_REGISTER);
  delay(100);
  uint16_t conductivityRaw = readRegister(CONDUCTIVITY_REGISTER);
  delay(100);
  uint16_t phRaw = readRegister(PH_REGISTER);
  delay(100);
  uint16_t nitrogenRaw = readRegister(NITROGEN_REGISTER);
  delay(100);
  uint16_t phosphorusRaw = readRegister(PHOSPHORUS_REGISTER);
  delay(100);
  uint16_t potassiumRaw = readRegister(POTASSIUM_REGISTER);

  float kelembapanValue = moistureRaw != MODBUS_ERROR ? moistureRaw / 10.0 : 0.0;
  float suhuValue = temperatureRaw != MODBUS_ERROR ? ((int16_t)temperatureRaw) / 10.0 : 0.0;
  float phValue = phRaw != MODBUS_ERROR ? phRaw / 10.0 : 0.0;

  data.validKelembapan = moistureRaw != MODBUS_ERROR && inRangeFloat(kelembapanValue, KELEMBAPAN_MIN, KELEMBAPAN_MAX);
  data.validSuhu = temperatureRaw != MODBUS_ERROR && inRangeFloat(suhuValue, SUHU_MIN, SUHU_MAX);
  data.validPh = phRaw != MODBUS_ERROR && inRangeFloat(phValue, PH_MIN, PH_MAX);
  data.validEc = conductivityRaw != MODBUS_ERROR && inRangeUInt(conductivityRaw, EC_MIN, EC_MAX);
  data.validNitrogen = nitrogenRaw != MODBUS_ERROR && inRangeUInt(nitrogenRaw, NITROGEN_MIN, NITROGEN_MAX);
  data.validPhosphorus = phosphorusRaw != MODBUS_ERROR && inRangeUInt(phosphorusRaw, PHOSPHORUS_MIN, PHOSPHORUS_MAX);
  data.validPotassium = potassiumRaw != MODBUS_ERROR && inRangeUInt(potassiumRaw, POTASSIUM_MIN, POTASSIUM_MAX);

  data.kelembapan = data.validKelembapan ? kelembapanValue : 0.0;
  data.suhu = data.validSuhu ? suhuValue : 0.0;
  data.ph = data.validPh ? phValue : 0.0;
  data.ec = data.validEc ? conductivityRaw : 0;
  data.nitrogen = data.validNitrogen ? nitrogenRaw : 0;
  data.phosphorus = data.validPhosphorus ? phosphorusRaw : 0;
  data.potassium = data.validPotassium ? potassiumRaw : 0;

  return data;
}

// Membuat URL endpoint API website
String makeApiUrl() {
  return String(API_BASE_URL) + "/api/sensor/" + KODE_NODE + "/reading";
}

// Membuat payload JSON untuk website
String makeJsonPayload(const SensorData& data) {
  String json = "{";
  json += "\"ph\":" + String(data.ph, 2) + ",";
  json += "\"kelembapan\":" + String(data.kelembapan, 2) + ",";
  json += "\"suhu\":" + String(data.suhu, 2) + ",";
  json += "\"nitrogen\":" + String(data.nitrogen);
  json += "}";
  return json;
}

// Mengirim data valid ke website
bool sendDataToWebsite(const SensorData& data) {
  if (!isMainDataValid(data)) {
    Serial.println("Data invalid. Send canceled.");
    lastHttpStatus = "SENS";
    return false;
  }

  ensureWiFiConnected();

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected. Send canceled.");
    lastHttpStatus = "WIFI";
    return false;
  }

  HTTPClient http;
  String url = makeApiUrl();
  String payload = makeJsonPayload(data);

  Serial.println("Sending PATCH request");
  Serial.println(url);
  Serial.println(payload);

  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(HTTP_TIMEOUT_MS);

  int httpCode = http.sendRequest("PATCH", payload);
  String response = http.getString();

  Serial.print("HTTP Code: ");
  Serial.println(httpCode);
  Serial.print("Response: ");
  Serial.println(response);

  http.end();

  if (httpCode >= 200 && httpCode < 300) {
    lastHttpStatus = String(httpCode);
    return true;
  }

  lastHttpStatus = httpCode > 0 ? String(httpCode) : "ERR";
  return false;
}

// Format debug data sensor
void printValueStatus(const String& label, bool valid, const String& value, const String& unit) {
  Serial.print(label);
  Serial.print(" : ");
  Serial.println(valid ? value + unit : "Invalid");
}

// Menampilkan data ke Serial Monitor
void printSensorToSerial(const SensorData& data) {
  Serial.println("Sensor data");
  printValueStatus("pH", data.validPh, String(data.ph, 2), "");
  printValueStatus("Kelembapan", data.validKelembapan, String(data.kelembapan, 2), " %");
  printValueStatus("Suhu", data.validSuhu, String(data.suhu, 2), " C");
  printValueStatus("Nitrogen", data.validNitrogen, String(data.nitrogen), " mg/kg");
  printValueStatus("EC", data.validEc, String(data.ec), " uS/cm");
  printValueStatus("Phosphorus", data.validPhosphorus, String(data.phosphorus), " mg/kg");
  printValueStatus("Potassium", data.validPotassium, String(data.potassium), " mg/kg");
}

// Inisialisasi perangkat
void setup() {
  Serial.begin(115200);
  delay(500);

  pinMode(RS485_RE_PIN, OUTPUT);
  pinMode(RS485_DE_PIN, OUTPUT);
  digitalWrite(RS485_RE_PIN, LOW);
  digitalWrite(RS485_DE_PIN, LOW);

  Serial2.begin(4800, SERIAL_8N1, RS485_RX_PIN, RS485_TX_PIN);

  Wire.begin(LCD_SDA_PIN, LCD_SCL_PIN);
  lcd.init();
  lcd.backlight();
  showBootScreen();

  Serial.println("SMARTO ESP32 RS485 WiFi API");
  Serial.print("Kode Node: ");
  Serial.println(KODE_NODE);

  delay(1500);
  connectWiFi();
  delay(1000);
  lcd.clear();
}

// Siklus baca sensor, kirim data, dan update LCD
void loop() {
  if (millis() - lastSendTime >= SEND_INTERVAL_MS || lastSendTime == 0) {
    lastSendTime = millis();

    SensorData sensorData = readSoilSensor();
    printSensorToSerial(sensorData);
    sendDataToWebsite(sensorData);
    showSensorOnLCD(sensorData);
  }

  delay(50);
}
