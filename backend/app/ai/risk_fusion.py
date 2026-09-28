from typing import Dict, Any, List
from app.ai.anomaly_detector import anomaly_detector
from app.ai.cv_detector import cv_detector
from app.ai.thermal_processor import thermal_processor
from app.ai.audio_processor import audio_processor

class MultimodalRiskFusionEngine:
    """
    Multimodal Risk Fusion Engine combining:
    - Gas, Temp, Humidity, Vibration (Deterministic Rules + Isolation Forest Anomaly Detection)
    - RGB Camera Evidence
    - Thermal Camera Evidence
    - Audio Evidence
    
    Produces deterministic safety compliance output alongside AI contextual fusion.
    """
    
    # Mandatory deterministic safety thresholds for underground mining safety
    GAS_CRITICAL_THRESHOLD_PPM = 40.0
    GAS_WARNING_THRESHOLD_PPM = 25.0
    TEMP_CRITICAL_THRESHOLD_C = 42.0
    TEMP_WARNING_THRESHOLD_C = 34.0
    VIB_CRITICAL_THRESHOLD_G = 0.45
    VIB_WARNING_THRESHOLD_G = 0.25
    BATTERY_LOW_THRESHOLD = 15.0

    def evaluate_risk(
        self,
        gas: float,
        temperature: float,
        humidity: float,
        vibration: float,
        battery: float = 90.0,
        rgb_human: bool = False,
        thermal_human: bool = False,
        audio_help: bool = False,
        obstacle: bool = False,
        smoke: bool = False,
        demo_mode: bool = False
    ) -> Dict[str, Any]:
        
        contributing_factors = []
        rule_triggers = []
        modalities = {
            "environmental": "ACTIVE",
            "rgb_vision": "ACTIVE" if (rgb_human or obstacle or demo_mode) else "INACTIVE",
            "thermal_ir": "ACTIVE" if (thermal_human or temperature > 30 or demo_mode) else "INACTIVE",
            "audio_acoustic": "ACTIVE" if (audio_help or demo_mode) else "INACTIVE",
            "location_imu": "ACTIVE"
        }

        # 1. Deterministic Rule Threshold Evaluation
        if gas >= self.GAS_CRITICAL_THRESHOLD_PPM:
            rule_triggers.append(f"CRITICAL GAS CONCENTRATION: {gas:.1f} ppm (Threshold: {self.GAS_CRITICAL_THRESHOLD_PPM} ppm)")
            contributing_factors.append("Severe Methane/CO Gas Spikes")
        elif gas >= self.GAS_WARNING_THRESHOLD_PPM:
            rule_triggers.append(f"Elevated Gas Concentration: {gas:.1f} ppm")
            contributing_factors.append("Elevated Gas Levels")

        if temperature >= self.TEMP_CRITICAL_THRESHOLD_C:
            rule_triggers.append(f"CRITICAL TEMPERATURE: {temperature:.1f}°C (Threshold: {self.TEMP_CRITICAL_THRESHOLD_C}°C)")
            contributing_factors.append("Extreme Mine Ambient Heat Spike")
        elif temperature >= self.TEMP_WARNING_THRESHOLD_C:
            rule_triggers.append(f"Elevated Temperature: {temperature:.1f}°C")
            contributing_factors.append("Rising Mine Temperature")

        if vibration >= self.VIB_CRITICAL_THRESHOLD_G:
            rule_triggers.append(f"CRITICAL SEISMIC VIBRATION: {vibration:.2f}g")
            contributing_factors.append("High Structural / Rockfall Seismic Vibration")
        elif vibration >= self.VIB_WARNING_THRESHOLD_G:
            rule_triggers.append(f"Abnormal Vibration: {vibration:.2f}g")
            contributing_factors.append("Elevated Structural Vibration")

        if battery <= self.BATTERY_LOW_THRESHOLD:
            rule_triggers.append(f"LOW ROVER BATTERY: {battery:.1f}%")
            contributing_factors.append("Low Battery Level")

        # 2. Environmental Machine Learning Anomaly Detection (Isolation Forest)
        is_env_anomaly, env_score = anomaly_detector.predict(gas, temperature, humidity, vibration)
        if is_env_anomaly and env_score > 60:
            modalities["environmental"] = "WARNING"
            contributing_factors.append(f"Isolation Forest Anomaly Score: {env_score:.1f}%")

        # 3. Vision + Thermal + Audio Evidence Fusion
        human_evidence_count = 0
        if rgb_human:
            human_evidence_count += 1
            modalities["rgb_vision"] = "SUPPORTING EVIDENCE"
            contributing_factors.append("RGB Camera Visual Miner Evidence")
        
        if thermal_human:
            human_evidence_count += 1
            modalities["thermal_ir"] = "SUPPORTING EVIDENCE"
            contributing_factors.append("Thermal Infrared Body Heat Signature (36.8°C)")
        
        if audio_help:
            human_evidence_count += 1
            modalities["audio_acoustic"] = "SUPPORTING EVIDENCE"
            contributing_factors.append("Acoustic Sensor Distress Signal Detected")

        # Determine Event Type & Overall Risk Level
        risk_level = "NORMAL"
        confidence = 85.0
        event_type = "Routine Monitoring"
        action = "Maintain automated reconnaissance path. Monitor environmental telemetry."

        # Risk Classification Logic
        if human_evidence_count >= 2:
            event_type = "Trapped Worker Detected (High Multimodal Confidence)"
            risk_level = "CRITICAL"
            confidence = 94.5
            action = "IMMEDIATE RECONNAISSANCE: Hold rover position. Dispatch specialized mine rescue team with oxygen apparatus to exact coordinates."
        elif human_evidence_count == 1:
            event_type = "Possible Human Detection (Incomplete Evidence)"
            risk_level = "HIGH"
            confidence = 72.0
            action = "Single modality evidence detected. Pivot rover cameras to confirm thermal and visual evidence before rescue team entry."

        if gas >= self.GAS_CRITICAL_THRESHOLD_PPM or temperature >= self.TEMP_CRITICAL_THRESHOLD_C or vibration >= self.VIB_CRITICAL_THRESHOLD_G:
            risk_level = "CRITICAL"
            confidence = 98.0
            event_type = "Hazardous Atmospheric/Structural Critical Event"
            action = "MANDATORY EVACUATION ALERT: Hazardous atmospheric/structural conditions detected. Follow official MSHA / Mine Safety Protocol 4B immediately."
        elif gas >= self.GAS_WARNING_THRESHOLD_PPM or temperature >= self.TEMP_WARNING_THRESHOLD_C or is_env_anomaly:
            if risk_level not in ["CRITICAL", "HIGH"]:
                risk_level = "HIGH" if (gas >= self.GAS_WARNING_THRESHOLD_PPM and temperature >= self.TEMP_WARNING_THRESHOLD_C) else "MODERATE"
                event_type = "Environmental Anomaly Event"
                action = "Inspect affected tunnel section remotely. Verify gas ventilation status and check structural integrity."

        if not contributing_factors:
            contributing_factors.append("Sensory metrics within baseline safe operational limits")

        return {
            "risk_level": risk_level,
            "confidence": confidence,
            "event_type": event_type,
            "contributing_factors": contributing_factors,
            "rule_triggers": rule_triggers,
            "modalities": modalities,
            "recommended_action": action,
            "disclaimer": "AI risk assessment is an operational support tool and does NOT override mandatory statutory mine safety procedures."
        }

risk_fusion_engine = MultimodalRiskFusionEngine()
