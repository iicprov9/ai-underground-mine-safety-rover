import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000/ws/telemetry';

export const api = {
  getHealth: () => axios.get(`${API_BASE_URL}/health`),
  getRovers: () => axios.get(`${API_BASE_URL}/rovers`),
  connectRover: (config) => axios.post(`${API_BASE_URL}/rover/connect`, config),
  disconnectRover: (rover_id) => axios.post(`${API_BASE_URL}/rover/disconnect?rover_id=${rover_id}`),
  getRoverData: (rover_id = 'ROVER-01') => axios.get(`${API_BASE_URL}/rover/${rover_id}/data`),
  sendEsp32Data: (rover_id, data) => axios.post(`${API_BASE_URL}/rover/${rover_id}/data`, data),
  sendRoverControl: (cmd) => axios.post(`${API_BASE_URL}/rover/control`, cmd),
  getRoverStatus: (rover_id = 'ROVER-01') => axios.get(`${API_BASE_URL}/rover/${rover_id}/status`),
  getEvents: () => axios.get(`${API_BASE_URL}/events`),
  acknowledgeEvent: (event_id) => axios.post(`${API_BASE_URL}/events/${event_id}/acknowledge`),
  getMissions: () => axios.get(`${API_BASE_URL}/missions`),
  createMission: (mission) => axios.post(`${API_BASE_URL}/missions`, mission),
  analyzeAI: (req) => axios.post(`${API_BASE_URL}/ai/analyze`, req),
  getConfig: (rover_id = 'ROVER-01') => axios.get(`${API_BASE_URL}/config?rover_id=${rover_id}`),
  updateConfig: (config) => axios.post(`${API_BASE_URL}/config`, config),
  getHistory: (rover_id = 'ROVER-01', range = '30m', format = 'json') => 
    axios.get(`${API_BASE_URL}/history?rover_id=${rover_id}&time_range=${range}&format=${format}`, {
      responseType: format === 'csv' ? 'blob' : 'json'
    }),
  getWsUrl: (rover_id = 'ROVER-01') => `${WS_BASE_URL}/${rover_id}`,

  // ThingSpeak IoT direct API integration helper
  fetchThingSpeakData: async (channelId, apiKey) => {
    const url = `https://api.thingspeak.com/channels/${channelId}/feeds/last.json${apiKey ? `?api_key=${apiKey}` : ''}`;
    const response = await axios.get(url);
    const feed = response.data;
    
    // Parse ThingSpeak fields into standard rover telemetry structure
    const gas = parseFloat(feed.field1 || 14.2);
    const temp = parseFloat(feed.field2 || 29.1);
    const hum = parseFloat(feed.field3 || 62.5);
    const vib = parseFloat(feed.field4 || 0.08);
    const battery = parseFloat(feed.field5 || 92.0);
    const locX = parseFloat(feed.field6 || 125.0);
    const locY = parseFloat(feed.field7 || 85.0);

    return {
      rover_id: `THINGSPEAK-CH${channelId}`,
      timestamp: feed.created_at || new Date().toISOString(),
      gas: { value: gas, unit: 'ppm', status: gas > 40 ? 'CRITICAL' : (gas > 25 ? 'WARNING' : 'SAFE') },
      temperature: { value: temp, unit: '°C', status: temp > 42 ? 'CRITICAL' : (temp > 34 ? 'WARNING' : 'SAFE') },
      humidity: { value: hum, unit: '%', status: 'SAFE' },
      vibration: { value: vib, unit: 'g', status: vib > 0.45 ? 'CRITICAL' : (vib > 0.25 ? 'WARNING' : 'SAFE') },
      battery: battery,
      imu: { x: 0.01, y: 0.02, z: 0.98 },
      location: { x: locX, y: locY, tunnel_id: 'Tunnel A' },
      entry_id: feed.entry_id,
      raw_thingspeak: feed
    };
  }
};
