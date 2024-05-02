import React, { useState, useEffect } from 'react';
import { readCSV } from './logica/grafo';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

const MapView = () => {
  const [file, setFile] = useState(null);
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };





  
  const handleProcessFile = () => {
    if (file) {
      readCSV(file)
        .then(graph => {
          const vertices = graph.getVertices();
          console.log(vertices);
  
          // Transformar vértices en nodos
          const nodes = vertices.map(vertex => ({
            id: vertex.code,
            position: [vertex.latitude, vertex.longitude]
          }));
  
          // Transformar vértices en aristas
          const edges = [];
          vertices.forEach(vertex => {
            if (vertex.destinations && vertex.destinations.length > 0) {
              vertex.destinations.forEach(destination => {
                edges.push({ from: vertex.code, to: destination });
              });
            }
          });
  
          console.log('Nodes:', nodes);
          console.log('Edges:', edges);
  
          setVertices(vertices); // Guarda los vértices en el estado
          extractEdges(vertices);
        })
        .catch(error => {
          console.error('Error processing CSV:', error);
        });
    } else {
      console.log('Please select a file to process.');
    }
  };

  


  const extractEdges = (vertices) => {
    const newEdges = [];
    Object.keys(vertices).forEach(key => {
      const vertex = vertices[key];
      vertex.destinations.forEach(destinationCode => {
        if (vertices[destinationCode]) {
          const destination = vertices[destinationCode];
          newEdges.push([[vertex.latitude, vertex.longitude], [destination.latitude, destination.longitude]]);
        }
      });
    });
    setEdges(newEdges);
  };

  const position = [51.505, -0.09]; // Coordenadas iniciales para el centro del mapa

  return (
    <>
      <div>
        <input type="file" onChange={handleFileChange} accept=".csv" />
        <button onClick={handleProcessFile}>Process CSV and Show Graph</button>
      </div>
      <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {vertices.map((vertex, idx) => (
          <Marker key={idx} position={[vertex.latitude, vertex.longitude]}>
            <Popup>
              {vertex.name}<br/>
              {vertex.city}, {vertex.country}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default MapView;




// import React, { useState } from 'react';
// import { readCSV } from './logica/grafo';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';

// const MapView = () => {
//   const [file, setFile] = useState(null);
//   const [airports, setAirports] = useState([]);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleProcessFile = () => {
//     if (file) {
//       readCSV(file).then(data => {
//         setAirports(data); // Asumimos que data es un array de objetos con los datos de cada aeropuerto
//       }).catch(error => {
//         console.error('Error processing file:', error);
//       });
//     } else {
//       console.log('Please select a file to process.');
//     }
//   };

//   const position = [51.505, -0.09]; // Coordenadas iniciales para el centro del mapa

//   return (
//     <>
//       <div>
//         <input type="file" onChange={handleFileChange} accept=".csv" />
//         <button onClick={handleProcessFile}>Process CSV</button>
//       </div>
//       <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         {airports.map((airport, index) => (
//           <Marker
//             key={index}
//             position={[airport['Source Airport Latitude'], airport['Source Airport Longitude']]}
//           >
//             <Popup>
//               {airport['Source Airport Name']} <br /> {airport['Source Airport City']}
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </>
//   );
// };

// export default MapView;
