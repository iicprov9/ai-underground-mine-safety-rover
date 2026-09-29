# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 18, Vite, Bootstrap 5, Lucide Icons, Chart.js, Canvas 2D, WebSockets, Python FastAPI

## Users

Primary users are underground mine rescue commanders, incident response teams, and safety engineers operating in high-stress crisis and hazardous shaft reconnaissance scenarios.

## Product Purpose

Provide an immediate, reliable, mission-critical command dashboard for real-time reconnaissance in underground mines, streaming rover sensor data, detecting environmental hazards, and enabling safe remote teleoperation.

## Positioning

Multimodal AI Risk Assessment Engine that fuses environmental gas levels (CH4, CO), acoustic distress cues, thermal signatures, and seismic vibration into instantaneous, deterministic risk scoring and actionable statutory MSHA/DGMS alerts.

## Operating Context

- Subterranean mining shafts, collapsed tunnels, and high-risk extraction zones.
- Variable network latency with WebSocket telemetry streaming and simulation fallback mode.
- High-contrast, low-cognitive-load emergency command center displays.

## Capabilities and Constraints

- **Real-Time Telemetry**: Real-time gas (CH4, CO), ambient temperature, humidity, vibration/IMU, ultrasonic distance.
- **Multimodal AI Risk Fusion**: Automatic risk severity classification, anomaly threshold detection, and audio/thermal hazard badges.
- **Remote Rover Teleoperation**: Directional D-pad and keyboard controls (WASD/Arrows), Emergency Stop, camera pan/tilt, and headlight toggles.
- **Interactive 2D Shaft Mapping**: Canvas-based real-time rover localization, breadcrumb pathing, and hazard zone overlays.
- **Multilingual Command Interface**: Instant one-click language switching across 7 global and regional languages (English 🇺🇸, Hindi 🇮🇳, Telugu 🇮🇳, Spanish 🇪🇸, French 🇫🇷, German 🇩🇪, Chinese 🇨🇳).
- **Regulatory Disclaimers**: Explicit statutory safety protocol compliance (does not supersede official rescue authority).

## Brand Commitments

- **Aesthetic**: Mission-critical Red & Black tactical command HUD, obsidian carbon glassmorphism cards, glowing crimson hazard highlights, high-contrast typography.
- **Tone**: Authoritative, accessible, immediate, zero-distraction.

## Evidence on Hand

- Complete working repository with full-stack React frontend (`frontend/`) and FastAPI backend (`backend/`).
- Prior heuristic evaluation and usability critique (`.impeccable/critique/rescue-dashboard.md`).

## Product Principles

1. **Zero-Latency Clarity**: Critical telemetry and danger levels must be scannable in under 500ms without cognitive clutter.
2. **Fail-Safe Operation**: Hardware disconnects or packet drops must trigger instant visual fallback/simulation states rather than blank UI.
3. **Statutory Integrity**: Disclaimers, hazard thresholds, and acknowledge states must adhere to strict mining safety regulations.
4. **Actionable Emergency Controls**: E-Stop and manual override affordances must remain globally visible and instantly accessible.
