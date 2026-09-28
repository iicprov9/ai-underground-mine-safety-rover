import random
import math
from datetime import datetime
from typing import Dict, Any

class SimulationService:
    """
    Generates realistic dynamic simulated sensor readings and underground rover movement
    when hardware ESP32 is offline or Demo Mode is toggled ON.
    """
    def __init__(self):
        self.step_count = 0
        self.loc_x = 120.0
        self.loc_y = 80.0
        self.tunnel_index = 0
        self.tunnels = ["Tunnel A - Main Entrance", "Tunnel B - Deep Shaft", "Tunnel C - Collapse Risk Sector", "Tunnel D - Ventilation Bay"]
        self.direction = "FORWARD"
        self.speed = 0.65
        self.battery = 94.0

    def generate_telemetry(self, rover_id: str = "ROVER-01") -> Dict[str, Any]:
        self.step_count += 1
        
        # Simulate realistic movement in underground tunnels
        angle = (self.step_count * 0.08) % (2 * math.pi)
        dx = math.cos(angle) * 1.8
        dy = math.sin(angle * 0.5) * 1.2
        self.loc_x = round(max(20.0, min(380.0, self.loc_x + dx)), 1)
        self.loc_y = round(max(20.0, min(220.0, self.loc_y + dy)), 1)
        
        # Slow battery drain
        if self.step_count % 15 == 0 and self.battery > 12.0:
            self.battery = round(self.battery - 0.1, 1)

        # Base sensors with organic oscillations
        base_gas = 12.0 + 3.0 * math.sin(self.step_count * 0.15)
        base_temp = 28.0 + 1.5 * math.cos(self.step_count * 0.1)
        base_humidity = 64.0 + 4.0 * math.sin(self.step_count * 0.05)
        base_vibration = 0.05 + 0.03 * abs(math.sin(self.step_count * 0.2))

        # Periodically trigger simulated anomaly events for demo testing (every 40 steps)
        trigger_gas_anomaly = (self.step_count % 40 in range(12, 18))
        trigger_human_detection = (self.step_count % 40 in range(25, 30))

        if trigger_gas_anomaly:
            gas_val = round(base_gas + random.uniform(22.0, 32.0), 1)
            temp_val = round(base_temp + random.uniform(8.0, 14.0), 1)
            vib_val = round(base_vibration + random.uniform(0.25, 0.40), 2)
        else:
            gas_val = round(base_gas + random.uniform(-0.5, 0.5), 1)
            temp_val = round(base_temp + random.uniform(-0.3, 0.3), 1)
            vib_val = round(base_vibration + random.uniform(-0.01, 0.01), 2)

        hum_val = round(base_humidity + random.uniform(-1.0, 1.0), 1)

        imu_x = round(0.02 * math.sin(self.step_count * 0.3), 3)
        imu_y = round(0.02 * math.cos(self.step_count * 0.3), 3)
        imu_z = round(0.98 + 0.01 * math.sin(self.step_count * 0.1), 3)

        current_tunnel = self.tunnels[(self.step_count // 50) % len(self.tunnels)]

        return {
            "rover_id": rover_id,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "gas": max(0.0, gas_val),
            "temperature": temp_val,
            "humidity": hum_val,
            "vibration": max(0.0, vib_val),
            "battery": self.battery,
            "imu": {
                "x": imu_x,
                "y": imu_y,
                "z": imu_z
            },
            "location": {
                "x": self.loc_x,
                "y": self.loc_y,
                "tunnel_id": current_tunnel
            },
            "demo_triggers": {
                "gas_anomaly": trigger_gas_anomaly,
                "human_detected": trigger_human_detection
            }
        }

simulation_service = SimulationService()
