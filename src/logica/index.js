class Graph {
    constructor() {
        this.vertices = {};
    }

    addVertex(code, vertex) {
        if (!this.vertices[code]) {
            this.vertices[code] = vertex;
        }
    }

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

    connectVertices() {
        for (let source in this.vertices) {
            const destinations = this.vertices[source].destinations;
            destinations.forEach(destination => {
                if (this.vertices[destination]) { // Solo añadir la arista si el destino existe
                    this.addEdge(source, destination);
                }
            });
        }
    }

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
       //punto 1
       //Aparte lo uso para probar que sirvan los pesos y este todo bien
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
    
    
}


function readCSV() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
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
                
                // Imprimir todas las distancias ahora que todos los vértices están conectados
               // graph.printAllDistances();

               //Punto 1 probar
               graph.printVertexAttributes("COK")
              
            }
        });
    } else {
        console.log('No file selected.');
    }
}
