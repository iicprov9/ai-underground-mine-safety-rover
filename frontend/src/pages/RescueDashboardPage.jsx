import React from 'react';
import TelemetryCards from '../components/TelemetryCards';
import MineMap2D from '../components/MineMap2D';
import CameraFeeds from '../components/CameraFeeds';
import AIDetectionPanel from '../components/AIDetectionPanel';
import RiskAssessmentPanel from '../components/RiskAssessmentPanel';
import MultimodalFusionView from '../components/MultimodalFusionView';
import RoverControlPanel from '../components/RoverControlPanel';
import EventManagementTable from '../components/EventManagementTable';
import EmergencyAlertBanner from '../components/EmergencyAlertBanner';
import MissionManager from '../components/MissionManager';

export default function RescueDashboardPage({
  telemetry,
  history,
  events,
  mission,
  isDemoMode,
  activeAlert,
  onAcknowledgeAlert,
  onAcknowledgeEvent,
  onMissionUpdate
}) {
  return (
    <div className="container-fluid py-3 px-3 vstack gap-3">
      {/* 1. High-Priority Emergency Alert Banner */}
      {activeAlert && (
        <EmergencyAlertBanner alert={activeAlert} onAcknowledge={onAcknowledgeAlert} />
      )}

      {/* 2. Mission Tracker Bar */}
      <MissionManager mission={mission} onMissionUpdate={onMissionUpdate} />

      {/* 3. Live Environmental Sensor Telemetry Grid */}
      <TelemetryCards telemetry={telemetry} history={history} />

      {/* 4. Mine Location Map & Remote Control Panel Row */}
      <div className="row g-3">
        <div className="col-lg-7">
          <MineMap2D telemetry={telemetry} events={events} />
        </div>
        <div className="col-lg-5">
          <RoverControlPanel roverId={telemetry?.rover_id || 'ROVER-01'} isDemoMode={isDemoMode} />
        </div>
      </div>

      {/* 5. Live Camera Streams (RGB & Thermal IR) */}
      <CameraFeeds isDemoMode={isDemoMode} telemetry={telemetry} />

      {/* 6. AI Detection, Risk Assessment & Multimodal Fusion Row */}
      <div className="row g-3">
        <div className="col-lg-4">
          <AIDetectionPanel aiRisk={telemetry?.ai_risk} isDemoMode={isDemoMode} />
        </div>
        <div className="col-lg-4">
          <RiskAssessmentPanel aiRisk={telemetry?.ai_risk} />
        </div>
        <div className="col-lg-4">
          <MultimodalFusionView modalities={telemetry?.ai_risk?.modalities} isDemoMode={isDemoMode} />
        </div>
      </div>

      {/* 7. Hazard and Event Management Table */}
      <EventManagementTable events={events} onAcknowledgeEvent={onAcknowledgeEvent} />
    </div>
  );
}
