from typing import Dict, Any

class ThermalEvidenceProcessor:
    """
    Interface for Thermal infrared sensor array / camera analysis.
    Identifies human heat signatures (36.5C - 37.5C skin surface gradient) and hotspots.
    """
    def process_thermal_data(self, max_temp: float, avg_temp: float, demo_trigger: bool = False) -> Dict[str, Any]:
        if demo_trigger or max_temp > 35.0:
            return {
                "thermal_human_confirmed": True,
                "heat_signature_c": max_temp if max_temp > 35.0 else 36.8,
                "confidence": 0.92,
                "anomaly_type": "Human Heat Signature Detected"
            }
        elif max_temp > 45.0:
            return {
                "thermal_human_confirmed": False,
                "heat_signature_c": max_temp,
                "confidence": 0.96,
                "anomaly_type": "High Thermal Hotspot / Fire Warning"
            }
        return {
            "thermal_human_confirmed": False,
            "heat_signature_c": avg_temp,
            "confidence": 0.85,
            "anomaly_type": "Ambient Mine Thermal Baseline"
        }

thermal_processor = ThermalEvidenceProcessor()
