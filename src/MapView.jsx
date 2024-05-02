import React, { useState } from 'react';
import { readCSV } from './logica/grafo';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';

const MapView = () => {
  const [file, setFile] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vertexDetails, setVertexDetails] = useState(null);
  const [vertexDetails10, setVertexDetails10] = useState(null);
  const [airportCode, setAirportCode] = useState('');
  const [airportCode2, setAirportCode2] = useState('');
  const [farthestAirports, setFarthestAirports] = useState([]);
  const [init, setInit] = useState('');
  const [end, setEnd] = useState('');
  const [total, setTotal] = useState('');
  const [showShortestPathDetails, setShowShortestPathDetails] = useState(false);
  

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleProcessFile = () => {
    if (file) {
      setLoading(true); // Comenzar carga
      readCSV(file)
        .then(graph => {
          const vertices = graph.getVertices();

          // Transformar vértices en nodos
          const newNodes = vertices.map(vertex => ({
            id: vertex.code,
            position: [vertex.latitude, vertex.longitude],
            code: vertex.code,
            city: vertex.city, 
            country: vertex.country
          }));

          // Transformar aristas en líneas
          const newLines = [];
          vertices.forEach(vertex => {
            if (vertex.destinations && vertex.destinations.length > 0) {
              vertex.destinations.forEach(destination => {
                const fromNode = newNodes.find(node => node.id === vertex.code);
                const toNode = newNodes.find(node => node.id === destination);
                if (fromNode && toNode) {
                  newLines.push([fromNode.position, toNode.position]);
                }
              });
            }
          });

          setNodes(newNodes); 
          setLines(newLines);
          setShowShortestPathDetails(false); 
        })
        .catch(error => {
          console.error('Error processing CSV:', error);
        })
        .finally(() => {
          setLoading(false); // Finalizar carga
        });
    } else {
      console.log('Please select a file to process.');
    }
  };


  const handlesPunto1 = () => {
    if (file && airportCode.trim() !== '') {
 // Comenzar carga
      readCSV(file)
        .then(graph => {
          const vertices = graph.printVertexAttributes(airportCode.trim());
          setVertexDetails(vertices); // Actualiza el estado con los detalles del vértice
        })
        .catch(error => {
          console.error('Error processing CSV:', error);
        })
        .finally(() => {
   // Finalizar carga
        });
    } else {
      console.log('Please select a file and enter an airport code to process.');
    }
  };
  
  const handlesPunto2 = () => {
    if (file && airportCode2.trim() !== '') {
     // Comenzar carga
      readCSV(file)
        .then(graph => {
          const vertices10 = graph.getFarthestAirports(airportCode2.trim());
          setFarthestAirports(vertices10); // Actualiza el estado con los detalles de los aeropuertos más lejanos
        })
        .catch(error => {
          console.error('Error processing CSV:', error);
        })
        .finally(() => {
           // Finalizar carga
        });
    } else {
      console.log('Please select a file and enter an airport code to process.');
    }
  };
  



  const handlePunto3 = () => {
    if (file && init.trim() !== '' && end.trim() !== '') {
      setLoading(true); // Comenzar carga
      readCSV(file)
        .then(graph => {
          const { pathDetails,distanceDetails  } = graph.showShortestPath(init.trim(), end.trim());
  
          // Transformar pathDetails en nodos
          const newNodes = pathDetails.map(step => ({
            id: step.codigo,
            position: [step.latitud, step.longitud],
            code: step.codigo,
            city: step.ciudad,
            country: step.pais
          }));
  
          // Transformar pathDetails en líneas
          const newLines = [];
          for (let i = 0; i < pathDetails.length - 1; i++) {
            const fromNode = newNodes.find(node => node.id === pathDetails[i].codigo);
            const toNode = newNodes.find(node => node.id === pathDetails[i + 1].codigo);
            if (fromNode && toNode) {
              newLines.push([fromNode.position, toNode.position]);
            }
          }
  
          setNodes(newNodes);
          setLines(newLines);
          setTotal(distanceDetails)
          setShowShortestPathDetails(true);
        })
        .catch(error => {
          console.error('Error processing CSV:', error);
        })
        .finally(() => {
          setLoading(false); // Finalizar carga
        });
    } else {
      console.log('Please select a file and enter valid initial and destination airports.');
    }
  };
  







  
  const position = [51.505, -0.09];

  return (
    <>
      <div>
        <input type="file" onChange={handleFileChange} accept=".csv" />
        <button onClick={handleProcessFile}>Procesar CSV para generear Grafo</button>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <MapContainer center={position} zoom={2} style={{ height: '100vh' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {nodes.map(node => (
            <Marker key={node.id} position={node.position}>
              <Popup>
                {node.code}<br/>
                {node.city}, {node.country}
              </Popup>
            </Marker>
          ))}
          {lines.map((line, index) => (
            <Polyline key={index} positions={line} color="blue" />
          ))}
        </MapContainer>
      )}


<input
  type="text"
  placeholder="Codigo de aeropuerto (e.g., COK)"
  value={airportCode}
  onChange={(e) => setAirportCode(e.target.value)}
/>

<button onClick={handlesPunto1}>Obtener detalles de aeropuerto</button>

{vertexDetails && (
  <div>
    <p>Codigo: {vertexDetails.code}</p>
    <p>Nombre: {vertexDetails.name}</p>
    <p>Ciudad: {vertexDetails.city}</p>
    <p>Pais: {vertexDetails.country}</p>
    <p>Latitud: {vertexDetails.latitude}</p>
    <p>Longitud: {vertexDetails.longitude}</p>
    <p>Destinos: {vertexDetails.destinations}</p>

    {/* Mostrar detalles de los bordes (edges) si están disponibles */}
    {vertexDetails.edges && (
      <div>
        <p>Detalles de las Aristas:</p>
        <ul>
          {Object.entries(vertexDetails.edges).map(([destination, distance]) => (
            <li key={destination}>
              <strong>{destination}:</strong> {distance}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}


<input
  type="text"
  placeholder="Codigo de aeropuerto (e.g., COK)"
  value={airportCode2}
  onChange={(e) => setAirportCode2(e.target.value)}
/>

<button onClick={handlesPunto2}>Obtener los 10 caminos</button>
{farthestAirports.length > 0 && (
  <div>
    <p>Los 10 aeropuertos cuyos caminos mínimos desde {airportCode2} son los más largos:</p>
    {farthestAirports.map((airport, index) => (
      <div key={index}>
        <p>Código: {airport.code}</p>
        <p>Nombre: {airport.name}</p>
        <p>Ciudad: {airport.city}</p>
        <p>País: {airport.country}</p>
        <p>Latitud: {airport.latitude}</p>
        <p>Longitud: {airport.longitude}</p>
        <p>Distancia: {airport.distance}</p>
      </div>
    ))}
  </div>
)}











<input
  type="text"
  placeholder="Aeropuerto inicial (e.g., COK)"
  value={init}
  onChange={(e) => setInit(e.target.value)}
/>
<input
  type="text"
  placeholder="Aeropuerto destino (e.g., GIG)"
  value={end}
  onChange={(e) => setEnd(e.target.value)}
/>
<button onClick={() => handlePunto3(init, end)}>Mostrar Camino Mínimo</button>



{showShortestPathDetails && (
  <>
    {nodes.map((node, index) => (
      <div key={node.id}>
        <p><strong>Paso {index + 1}:</strong></p>
        <p>Código: {node.code}</p>
        <p>Nombre: {node.name}</p>
        <p>Ciudad: {node.city}</p>
        <p>País: {node.country}</p>
        <p>Latitud: {node.position[0]}</p>
        <p>Longitud: {node.position[1]}</p>
      </div>
    ))}

    <p>Distancia total: {total.distanciaTotal} Km</p>
  </>
)}

    </>
  );
};

export default MapView;
