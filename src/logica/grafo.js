//Dijkstra cosas
class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(element, priority) {
        this.elements.push({ element, priority });
        this.elements.sort((a, b) => a.priority - b.priority); // Ordenar por prioridad ascendente
    }

    dequeue() {
        return this.elements.shift();
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

class Graph {
    constructor() {
        this.vertices = {};
    }

    //Se agregan vertices al grafo
    addVertex(code, vertex) {
        if (!this.vertices[code]) {
            this.vertices[code] = vertex;
        }
    }

    //Se agregan las aristas al grafo con su respectivo peso
    addEdge(source, destination) {
        if (this.vertices[source] && this.vertices[destination]) {
            const { latitude: lat1, longitude: lon1 } = this.vertices[source];
            const { latitude: lat2, longitude: lon2 } = this.vertices[destination];
            
            // Calcular la distancia entre los vértices utilizando la función Haversine
            const weight = this.calcularDistanciaHaversine(lat1, lon1, lat2, lon2);
            
            // Agregar la arista con el peso calculado
            if (!this.vertices[source].edges) {
                this.vertices[source].edges = {};
            }
            this.vertices[source].edges[destination] = weight;
        }
    }

    //Se conecta el grafo
    connectVertices() {
        for (let source in this.vertices) {
            const destinations = this.vertices[source].destinations;
            if (destinations && destinations.length > 0) {
                destinations.forEach(destination => {
                    if (this.vertices[destination]) {
                        this.addEdge(source, destination);
                    }
                });
            }
        }
    }
    
    //Metodo para obtener distancia en km entre 2 vertices con coords
    calcularDistanciaHaversine(lat1, lon1, lat2, lon2) {
        const radioTierra = 6371; // Radio de la Tierra en kilómetros
        const rad = Math.PI / 180; // Factor de conversión a radianes
        const deltaLat = (lat2 - lat1) * rad;
        const deltaLon = (lon2 - lon1) * rad;
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                  Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
                  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return radioTierra * c;
    }

    //Dijkstra para los 10 caminos minimos de un vertice
    dijkstra(source) {
        const distances = {};
        const visited = {};
        const queue = new PriorityQueue();

        // Inicializar distancias
        for (let code in this.vertices) {
            distances[code] = code === source ? 0 : Infinity;
            queue.enqueue(code, distances[code]);
        }

        while (!queue.isEmpty()) {
            const currentVertex = queue.dequeue().element;

            if (!this.vertices[currentVertex]) continue;

            visited[currentVertex] = true;

            if (this.vertices[currentVertex].edges) {
                for (let neighbor in this.vertices[currentVertex].edges) {
                    const weight = this.vertices[currentVertex].edges[neighbor];
                    //console.log(weight);
                    const totalDistance = distances[currentVertex] + weight;

                    if (totalDistance < distances[neighbor]) {
                        distances[neighbor] = totalDistance;
                        queue.enqueue(neighbor, totalDistance);
                    }
                }
            }
        }
        console.log(distances)

        return distances;
    }

    //Dijkstra1 para dado dos vertices hallar su distancia y su recorrido
    dijkstra1(source, destination) {
        const distances = {};
        const visited = {};
        const queue = new PriorityQueue();
        const previousVertex = {}; // Almacena el vértice previo para reconstruir el camino
    
        // Inicializar distancias
        for (let code in this.vertices) {
            //Si el codigo es igual al origen es 0 sino infinito
            distances[code] = code === source ? 0 : Infinity;
            queue.enqueue(code, distances[code]);
        }
    
        while (!queue.isEmpty()) {
            const currentVertex = queue.dequeue().element;
    
            if (!this.vertices[currentVertex]) continue;
    
            visited[currentVertex] = true;
    
            if (currentVertex === destination) break; // Si hemos alcanzado el destino, salir del bucle
    
            if (this.vertices[currentVertex].edges) {
                for (let neighbor in this.vertices[currentVertex].edges) {
                    const weight = this.vertices[currentVertex].edges[neighbor];
                    const totalDistance = distances[currentVertex] + weight;
    
                    if (totalDistance < distances[neighbor]) {
                        distances[neighbor] = totalDistance;
                        previousVertex[neighbor] = currentVertex; // Almacenar el vértice previo
                        queue.enqueue(neighbor, totalDistance);
                    }
                }
            }
        }
    
        return { distances, previousVertex };
    }

    reconstructPath(previousVertex, source, destination) {
        const path = [];
        let currentVertex = destination;
    
        while (currentVertex !== source) {
            path.unshift(currentVertex); // Agregar el vértice al principio del camino
            currentVertex = previousVertex[currentVertex]; // Obtener el vértice previo
        }
    
        path.unshift(source); // Agregar el vértice fuente al principio del camino
        return path;
    }


    //Mostrar en consola
    showShortestPath(source, destination) {
        const { distances, previousVertex } = this.dijkstra1(source, destination);
        const shortestPath = this.reconstructPath(previousVertex, source, destination);
        let totalDistance = 0;
        
        console.log(`El camino mínimo entre ${source} y ${destination} es:`);
        shortestPath.forEach((vertex, index) => {
            const airportInfo = this.vertices[vertex];
            const nextVertex = shortestPath[index + 1];
            if (nextVertex) {
                const edgeWeight = this.vertices[vertex].edges[nextVertex];
                totalDistance += edgeWeight;
            }
            console.log(`Paso ${index + 1}: Código: ${vertex}, Nombre: ${airportInfo.name}, Ciudad: ${airportInfo.city}, País: ${airportInfo.country}, Latitud: ${airportInfo.latitude}, Longitud: ${airportInfo.longitude}`);
        });
    
        console.log(`Distancia total: ${totalDistance.toFixed(2)} km`);
    }
    
    
    //Metodo para los 10 caminos minimos
    getFarthestAirports(source, numAirports = 10) {
        const distances = this.dijkstra(source);
    
        if (distances) { // Verificar si las distancias se calcularon correctamente
            // Filtrar distancias que no sean infinitas y luego ordenar por distancia descendente
            const sortedDistances = Object.entries(distances)
                .filter(([code, distance]) => distance !== Infinity)
                .sort((a, b) => b[1] - a[1])
                .slice(0, numAirports); // Tomar los 'numAirports' primeros
    
            console.log(`Los ${numAirports} aeropuertos cuyos caminos mínimos desde ${source} son los más largos:`);
            sortedDistances.forEach(([code, distance]) => {
                const airportInfo = this.vertices[code];
                if (airportInfo) {
                    console.log(`Código: ${code}, Nombre: ${airportInfo.name}, Ciudad: ${airportInfo.city}, País: ${airportInfo.country}, Latitud: ${airportInfo.latitude}, Longitud: ${airportInfo.longitude}, Distancia: ${distance.toFixed(2)} km`);
                } else {
                    console.log(`Aeropuerto ${code} no encontrado.`);
                }
            });
        } else {
            console.log("No se pudieron calcular las distancias.");
        }
    }
    

       //punto 1
       //Aparte lo uso para probar que sirvan los pesos y este todo bien
       //Basicamente pide todo como se ve en el console.log
       //destinations es un vector
    printVertexAttributes(code) {
        const vertex = this.vertices[code];
        if (vertex) {
            console.log(`Atributos del vértice ${code}:`);
            console.log(`Nombre: ${vertex.name}`);
            console.log(`Ciudad: ${vertex.city}`);
            console.log(`País: ${vertex.country}`);
            console.log(`Latitud: ${vertex.latitude}`);
            console.log(`Longitud: ${vertex.longitude}`);
            console.log(`Destinos: ${vertex.destinations.join(', ')}`);
    
            if (vertex.edges) {
                console.log("Pesos de las aristas:");
                for (let destination in vertex.edges) {
                    const weight = vertex.edges[destination];
                    console.log(`Arista hacia ${destination}: ${weight.toFixed(2)} km`);
                }
            } else {
                console.log("No hay aristas salientes desde este vértice.");
            }
        } else {
            console.log(`El vértice con código ${code} no existe en el grafo.`);
        }
    }

    getVertices() {
        const vertexList = [];
        for (const code in this.vertices) {
            const vertex = this.vertices[code];
            console.log(vertex)
            vertexList.push({
                code: code,
                name: vertex.name,
                city: vertex.city,
                country: vertex.country,
                latitude: vertex.latitude,
                longitude: vertex.longitude
            });
        }
        return vertexList;
    }



}






export function readCSV(file) {
    return new Promise((resolve, reject) => {
        const graph = new Graph(); // Instancia de la clase Graph

        if (file) {
            Papa.parse(file, {
                header: true,
                complete: function(results) {
                    results.data.forEach(row => {
                        const sourceCode = row['Source Airport Code'];
                        if (sourceCode) {
                            graph.addVertex(sourceCode, {
                                name: row['Source Airport Name'],
                                city: row['Source Airport City'],
                                country: row['Source Airport Country'],
                                latitude: parseFloat(row['Source Airport Latitude']),
                                longitude: parseFloat(row['Source Airport Longitude']),
                                destinations: row['Destination Airport Code'].replace(/[\[\]' ]/g, '').split(',')
                            });
                        }
                    });

                    // Conectar los vértices
                    graph.connectVertices();

                    // Resuelve la promesa con el grafo completamente construido
                    resolve(graph);
                },
                error: function(error) {
                    reject(error);
                }
            });
        } else {
            console.log('No file selected.');
            reject('No file selected.');
        }
    });
}






























import Papa from 'papaparse';
import { useCallback } from 'react';

export function readCSV2(file) {
    // const fileInput = document.getElementById('csvFile');
    // const file = fileInput.files[0];
    const graph = new Graph(); // Instancia de la clase Graph

    if (file) {
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                //leer y añadir todos los vértices
                results.data.forEach(row => {
                    const sourceCode = row['Source Airport Code'];
                    if (sourceCode) {
                        graph.addVertex(sourceCode, {
                            name: row['Source Airport Name'],
                            city: row['Source Airport City'],
                            country: row['Source Airport Country'],
                            latitude: parseFloat(row['Source Airport Latitude']),
                            longitude: parseFloat(row['Source Airport Longitude']),
                            destinations: row['Destination Airport Code'].replace(/[\[\]' ]/g, '').split(',')
                        });
                    }
                });


                //graph.verifyVertexAttributes();

                //conectar los vértices
                graph.connectVertices();

                

                // console.log("El grafo es conexo:", graph.isConnected());
                
                // Imprimir todas las distancias ahora que todos los vértices están conectados
               // graph.printAllDistances();

               //Punto 1  Atributos de " "
            //    graph.printVertexAttributes("COK")

               //Punto 2 Encontrar los 10 aeropuertos con los caminos mínimos más largos desde " "
            //    graph.getFarthestAirports("KMG");

                //Punto 3 Camino minimo desde " " hasta " " y pasando por {" ", " "... " "}
            //    graph.showShortestPath("COK", "KMG");

              
            }


        });
        graph.getVertices();
    } else {
        console.log('No file selected.');
    }
}


// llamar la funcion readCSV crea una instancia del grafo 
















































































































// codigo comentado que no se usaba 




/*
    printAllDistances() {
        for (let source in this.vertices) {
            const { latitude: lat1, longitude: lon1 } = this.vertices[source];
            this.vertices[source].destinations.forEach(destination => {
                if (this.vertices[destination]) {
                    const { latitude: lat2, longitude: lon2 } = this.vertices[destination];
                    const distancia = this.calcularDistanciaHaversine(lat1, lon1, lat2, lon2);
                    console.log(`Distancia de ${source} a ${destination}: ${distancia.toFixed(2)} km`);
                }
            });
        }
    }
*/
    
    
/*
    verifyVertexAttributes() {
        for (let code in this.vertices) {
            const vertex = this.vertices[code];
            const attributes = ['name', 'city', 'country', 'latitude', 'longitude', 'destinations'];
            const missingAttributes = attributes.filter(attr => !vertex.hasOwnProperty(attr));
            if (missingAttributes.length === 0) {
                console.log(`El vértice con código ${code} tiene todos los atributos correctamente definidos.`);
            } else {
                console.log(`El vértice con código ${code} está incompleto. Atributos faltantes: ${missingAttributes.join(', ')}.`);
            }
        }
    }
*/







    /*
    isConnected() {
        const visited = {};
        const queue = [];
        const startVertex = Object.keys(this.vertices)[0]; // Tomamos el primer vértice como punto de partida

        if (!startVertex) return false; // Si no hay vértices, el grafo no es conexo

        queue.push(startVertex);
        visited[startVertex] = true;

        while (queue.length > 0) {
            const currentVertex = queue.shift();

            if (this.vertices[currentVertex].edges) {
                for (const neighbor in this.vertices[currentVertex].edges) {
                    if (!visited[neighbor]) {
                        visited[neighbor] = true;
                        queue.push(neighbor);
                    }
                }
            }
        }

        // Si hemos visitado todos los vértices, el grafo es conexo
        return Object.keys(visited).length === Object.keys(this.vertices).length;
    }
*/    
    



