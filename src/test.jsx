import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';

const position = [51.505, -0.09]; // Coordenadas iniciales del mapa

function GraphMap() {
  // Nodos del grafo con sus coordenadas
  const nodes = [
    { id: 1, position: [51.505, -0.09] },
    { id: 2, position: [51.51, -0.1] },
    { id: 3, position: [51.51, -0.12] },
    { id: 4, position: [37.2502200, -119.7512600] },
  ];

  // Aristas del grafo con la posibilidad de múltiples destinos
  const edges = [
    { from: 1, to: [2, 3,4] },  // 1 conecta a 2 y 3
    { from: 3, to: [2,4] }      // 3 conecta a 2
  ];

  // Convertir los índices de nodos a coordenadas para las polilíneas
  const lines = edges.flatMap(edge => {
    const fromNode = nodes.find(node => node.id === edge.from);
    return edge.to.map(toId => {
      const toNode = nodes.find(node => node.id === toId);
      return [fromNode.position, toNode.position];
    });
  });

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {nodes.map(node => (
        <Marker key={node.id} position={node.position}></Marker>
      ))}
      {lines.map((line, index) => (
        <Polyline key={index} positions={line} color="red" />
      ))}
    </MapContainer>
  );
}

export default GraphMap;

