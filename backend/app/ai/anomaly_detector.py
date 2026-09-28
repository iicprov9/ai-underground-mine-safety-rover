import math
import logging
from typing import Tuple

logger = logging.getLogger(__name__)

class EnvironmentalAnomalyDetector:
    """
    Pure-Python statistical anomaly detector for underground mine telemetry.
    Computes multivariate Mahalanobis / Z-score metric for gas, temp, humidity, and vibration.
    Does not depend on external compiled C-extensions.
    """
    def __init__(self):
        # Baseline reference parameters (Safe underground mine baseline)
        self.means = {
            "gas": 12.0,       # ppm
            "temperature": 22.0,# °C
            "humidity": 60.0,   # %
            "vibration": 0.04   # g
        }
        self.stds = {
            "gas": 3.5,
            "temperature": 2.5,
            "humidity": 6.0,
            "vibration": 0.02
        }

    def predict(self, gas: float, temp: float, humidity: float, vibration: float) -> Tuple[bool, float]:
        """
        Returns:
            is_anomaly (bool): True if anomaly detected
            score (float): Anomaly confidence percentage (0.0 to 100.0)
        """
        z_gas = abs(gas - self.means["gas"]) / self.stds["gas"]
        z_temp = abs(temp - self.means["temperature"]) / self.stds["temperature"]
        z_hum = abs(humidity - self.means["humidity"]) / self.stds["humidity"]
        z_vib = abs(vibration - self.means["vibration"]) / self.stds["vibration"]

        # Combined weighted anomaly index
        combined_z = math.sqrt(z_gas**2 * 1.5 + z_temp**2 * 1.2 + z_hum**2 * 0.5 + z_vib**2 * 1.2)
        
        # Scale to score [0, 100]
        score = min(100.0, round((combined_z / 4.0) * 100.0, 1))
        is_anomaly = score > 55.0 or z_gas > 3.0 or z_temp > 3.0 or z_vib > 3.0

        return is_anomaly, score

anomaly_detector = EnvironmentalAnomalyDetector()
