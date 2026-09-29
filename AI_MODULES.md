# AI Architecture & Modules Reference Guide
## AI-Enabled Mobile Multisensory Rover and Rescue Command System for Underground Mines

This document details the functional specifications, algorithms, mathematical models, sensor inputs, and data flows for every AI module implemented in the system.

---

```
                       ┌─────────────────────────────────────────────────────────┐
                       │                   MULTISENSORY ROVER                    │
                       └────┬───────────┬───────────┬───────────┬───────────┬────┘
                            │           │           │           │           │
                     RGB Camera   Thermal IR     MQ-4/MQ-7     Microphone  IMU Sensor
                            │           │           │           │           │
                            ▼           ▼           ▼           ▼           ▼
                      ┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────┐
                      │ Module 1 ││ Module 2 ││ Module 3 ││ Module 4 ││ Module 5 │
                      │ RGB YOLO ││ Thermal  ││Isolation ││  Audio   ││ Seismic  │
                      │  Vision  ││ Signature││  Forest  ││Distress  ││ Attitude │
                      └────┬─────┘└────┬─────┘└────┬─────┘└────┬─────┘└────┬─────┘
                           │           │           │           │           │
                           └───────────┴─────┬─────┴───────────┴───────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │         Module 6          │
                               │ MULTIMODAL SENSORY FUSION │
                               │          ENGINE           │
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │  DETERMINISTIC SAFETY &   │
                               │      RISK ASSESSMENT      │
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │ RESCUE COMMAND DASHBOARD  │
                               │ (WebSockets & Live UI HUD)│
                               └───────────────────────────┘
```

---

## 1. Module 1: Computer Vision Person Detection (RGB YOLO)

### Purpose
Identifies trapped miners, emergency response personnel, or mannequins in low-visibility underground shafts using real-time RGB camera frames.

* **Hardware Source**: Wide-angle RGB Optical Camera (ESP32-CAM / USB Camera on Raspberry Pi)
* **Model Architecture**: YOLOv8-nano / YOLO11n (`ultralytics`)
* **Code Implementation**:
  * Backend: [`backend/app/ai/cv_detector.py`](file:///c:/Games/sih/batch9project/ai-underground-mine-safety-rover/backend/app/ai/cv_detector.py)
  * Frontend UI: [`frontend/src/components/CameraFeeds.jsx`](file:///c:/Games/sih/batch9project/ai-underground-mine-safety-rover/frontend/src/components/CameraFeeds.jsx) & [`frontend/src/components/AIDetectionPanel.jsx`](file:///c:/Games/sih/batch9project/ai-underground-mine-safety-rover/frontend/src/components/AIDetectionPanel.jsx)

### Input & Output
* **Input**: 1080p / 720p 30 FPS MJPEG Optical Stream.
* **Processing**: Real-time object detection inference for class `person` (`class_id: 0`). Generates normalized 2D bounding boxes and confidence scores.
* **Output**:
  * `human_detected`: `boolean` (`True` / `False`)
  * `confidence`: `float` (`0.0% – 100.0%`)
  * `bbox`: `[x_min, y_min, x_max, y_max]`
  * `label`: `"Trapped Miner / Worker"`

---

## 2. Module 2: Thermal Infrared Human Confirmation

### Purpose
Cross-validates visual human detections against infrared thermal signatures to eliminate false positives caused by mannequins, clothing, or dust, and ensures detection in total darkness or heavy smoke.

* **Hardware Source**: MLX90640 32x24 IR Array / FLIR Lepton Thermal Camera
* **Algorithm / Model**: Thermal gradient surface segmentation & human skin temperature window filter (**36.5°C – 37.5°C**).
* **Code Implementation**:
  * Backend: [`backend/app/ai/thermal_processor.py`](file:///c:/Games/sih/batch9project/ai-underground-mine-safety-rover/backend/app/ai/thermal_processor.py)
  * Frontend UI: [`frontend/src/components/CameraFeeds.jsx`](file:///c:/Games/sih/batch9project/ai-underground-mine-safety-rover/frontend/src/components/CameraFeeds.jsx) (FLIR Thermal Heatmap view)

### Input & Output
* **Input**: 768-pixel thermal array matrix (°C temperature array).
* **Processing**: Calculates peak hotspot temperature ($T_{max}$), average ambient baseline ($T_{avg}$), and evaluates delta $\Delta T = T_{max} - T_{avg}$.
* **Output**:
  * `thermal_human_confirmed`: `boolean`
  * `heat_signature_c`: `float` (e.g. `36.8°C`)
  * `anomaly_type`: `"Human Heat Signature Detected"` vs `"High Thermal Hotspot / Fire Warning"`

---

## 3. Module 3: Environmental Anomaly Detection (Isolation Forest & Multi-Z)

### Purpose
Detects hazardous atmospheric shifts, toxic gas buildup, and structural settling before catastrophic explosions or rockfalls occur.

* **Hardware Source**: MQ-4 (Methane $CH_4$), MQ-7 (Carbon Monoxide $CO$), DHT22 (Temp/Humidity), MPU6050 (Vibration).
* **Algorithm / Model**: Scikit-Learn Isolation Forest & Multivariate Mahalanobis / Z-Score Statistical Anomaly Index.
* **Code Implementation**:
  * Backend: [`backend/app/ai/anomaly_detector.py`](file:///c:/Games/sih/batch9project/ai-underground-mine-safety-rover/backend/app/ai/anomaly_detector.py)
  * Frontend UI: [`frontend/src/components/TelemetryCards.jsx`](file:///c:/Games/sih/batch9project/ai-underground-mine-safety-rover/frontend/src/components/TelemetryCards.jsx)

### Mathematical Formulation
$$\text{Score} = \sqrt{1.5 \cdot Z_{gas}^2 + 1.2 \cdot Z_{temp}^2 + 0.5 \cdot Z_{humidity}^2 + 1.2 \cdot Z_{vibration}^2}$$

### Statutory Deterministic Thresholds (MSHA Compliance)
* $CH_4$ / $CO$ Gas: **Safe** $<25\text{ ppm}$ | **Warning** $\ge 25\text{ ppm}$ | **Critical** $\ge 40\text{ ppm}$
* Ambient Temp: **Safe** $20-30^\circ\text{C}$ | **Warning** $>34^\circ\text{C}$ | **Critical** $\ge 42^\circ\text{C}$
* Vibration: **Safe** $<0.25\text{g}$ | **Warning** $\ge 0.25\text{g}$ | **Critical** $\ge 0.45\text{g}$

---

## 4. Module 4: Acoustic Distress & Voice Classification

### Purpose
Listens for human voices, emergency calls for help ("HELP!"), rhythmic pipe tapping, or structural rock creaking when workers are trapped behind collapsed rubble outside camera view.

* **Hardware Source**: I2S MEMS Omnidirectional Microphone Array.
* **Algorithm / Model**: Mel-Spectrogram feature extraction with acoustic frequency band filter.
* **Code Implementation**:
  * Backend: [`backend/app/ai/audio_processor.py`](file:///c:/Games/sih/batch9project/ai-underground-mine-safety-rover/backend/app/ai/audio_processor.py)
  * Frontend UI: [`frontend/src/components/AIDetectionPanel.jsx`](file:///c:/Games/sih/batch9project/ai-underground-mine-safety-rover/frontend/src/components/AIDetectionPanel.jsx)

### Input & Output
* **Input**: Raw audio amplitude stream and decibel dB SPL levels.
* **Processing**: Fast Fourier Transform (FFT) & speech frequency band analysis (300 Hz – 3400 Hz).
* **Output**:
  * `voice_detected`: `boolean`
  * `call_for_help`: `boolean`
  * `classification`: `"Acoustic Distress Signal ('HELP')"` vs `"Background Ventilation Noise"`

---

## 5. Module 5: 2D Spatial Localization & IMU Attitude

### Purpose
Calculates real-time underground shaft coordinates $(X, Y)$, tunnel sector mapping, pitch/roll tilt angles, and breadcrumb path history without GPS.

* **Hardware Source**: MPU6050 6-Axis Gyroscope/Accelerometer + Ultrasonic Distance + Wheel Odometry.
* **Code Implementation**:
  * Backend: Telemetry coordinate generation & WebSocket broadcasting.
  * Frontend UI: [`frontend/src/components/MineMap2D.jsx`](file:///c:/Games/sih/batch9project/ai-underground-mine-safety-rover/frontend/src/components/MineMap2D.jsx) (Canvas 2D rendering engine).

---

## 6. Module 6: Multimodal Sensory Fusion & Risk Assessment Engine

### Purpose
The central decision engine combining evidence across all modalities to produce an actionable, deterministic risk score for emergency rescue commanders.

* **Code Implementation**:
  * Backend: [`backend/app/ai/risk_fusion.py`](file:///c:/Games/sih/batch9project/ai-underground-mine-safety-rover/backend/app/ai/risk_fusion.py)
  * Frontend UI: [`frontend/src/components/RiskAssessmentPanel.jsx`](file:///c:/Games/sih/batch9project/ai-underground-mine-safety-rover/frontend/src/components/RiskAssessmentPanel.jsx) & [`frontend/src/components/MultimodalFusionView.jsx`](file:///c:/Games/sih/batch9project/ai-underground-mine-safety-rover/frontend/src/components/MultimodalFusionView.jsx)

### Weighted Fusion Scoring Matrix

| Modality Evidence | Trigger Condition | Weight Contribution |
| :--- | :--- | :--- |
| **RGB Vision** | YOLO Person Bounding Box | $+25\text{ pts}$ |
| **Thermal IR** | $36.5^\circ\text{C} - 37.5^\circ\text{C}$ Human Body Heat | $+30\text{ pts}$ |
| **Acoustic Audio** | Distress Voice / Pipe Tapping | $+20\text{ pts}$ |
| **Gas Anomaly** | $CH_4 / CO \ge 25\text{ ppm}$ | $+30\text{ pts}$ |
| **Thermal Ambient** | Ambient Temperature $\ge 34^\circ\text{C}$ | $+15\text{ pts}$ |
| **Seismic Settling** | Vibration $\ge 0.25\text{g}$ | $+20\text{ pts}$ |

### Output Risk Classification Levels

1. **`NORMAL`** (Score $<30$): Routine reconnaissance. Atmospheric conditions and tunnel structural metrics within baseline limits.
2. **`LOW`** (Score $30 - 45$): Minor sensory variance. Continued monitoring recommended.
3. **`MODERATE`** (Score $45 - 65$): Elevated gas concentration or temperature warning. Remote shaft inspection required.
4. **`HIGH`** (Score $65 - 85$): Single-modality human presence or dual sensor threshold spikes.
5. **`CRITICAL`** (Score $>85$): Multimodal confirmation of trapped worker (**RGB + Thermal + Audio**) OR lethal atmospheric / rockfall collapse hazard. Triggers immediate rescue protocol dispatch.

---

## 7. Summary AI Pipeline Table

| AI Function | Model / Algorithm | Primary Input Data | Real-Time Output |
| :--- | :--- | :--- | :--- |
| **Worker Detection** | YOLOv8-nano / YOLO11n | RGB Camera MJPEG stream | Bounding box, Person class label, Confidence % |
| **Thermal Verification** | Gradient Windowing / Delta $\Delta T$ | MLX90640 32x24 IR Array | Body heat confirmation ($36.8^\circ\text{C}$), Fire hotspot |
| **Gas & Hazard Anomaly** | Isolation Forest + Multi-Z Score | $CH_4$, $CO$, Temp, Humidity, Vib | Anomaly probability %, Threshold alert badge |
| **Acoustic Distress** | FFT / Spectrogram Voice Filter | I2S Microphone Audio | Distress cry detection, Noise classification |
| **2D Localization** | Odometry + IMU Dead Reckoning | 6-Axis IMU & Ultrasonic | Tunnel $(X, Y)$ coordinates, Path history |
| **Multimodal Fusion** | Weighted Cross-Modal Fusion | All 5 sensory inputs | Unified Risk Level (`CRITICAL` to `NORMAL`) |
