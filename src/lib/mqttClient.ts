import mqtt from 'mqtt';

const client = mqtt.connect('wss://veap-upnyk.id/mqtt', {
  clientId: 'web_client_' + Math.random().toString(16).substr(2, 8),
  reconnectPeriod: 1000,
});

export default client;
