import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

const MapView = () => {
  const position = [51.505, -0.09]; // Coordenadas iniciales para el centro del mapa
  const polylinePositions = [
    [51.505, -0.09],
    [51.51, -0.1],
    [51.51, -0.12],
  ];

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <Polyline positions={polylinePositions} color="red" />
    </MapContainer>
  );
};

export default MapView;
