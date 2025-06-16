import mqtt from 'mqtt';

const client = mqtt.connect('ws://147.93.96.15:9001', {
  clientId: 'web_client_' + Math.random().toString(16).substr(2, 8),
  reconnectPeriod: 1000,
});

export default client;
