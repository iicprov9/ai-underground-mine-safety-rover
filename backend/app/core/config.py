import os

class Settings:
    PROJECT_NAME: str = "AI-Enabled Mobile Multisensory Rover and Rescue Command System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./mine_rescue.db")
    
    # ESP32 Default Settings
    DEFAULT_ROVER_ID: str = "ROVER-01"
    DEFAULT_ESP32_IP: str = "192.168.1.105"
    DEFAULT_ESP32_CHANNEL: str = "CH-7742"
    DEFAULT_MQTT_BROKER: str = "broker.hivemq.com"
    DEFAULT_MQTT_TOPIC: str = "mine/rover/ROVER-01/telemetry"

settings = Settings()

