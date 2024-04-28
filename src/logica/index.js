class Grafo {
    constructor() {
        this.vertices = [];
        this.grafo = [];
    }

     // Método para conectar un vértice con todos los demás
     conectarConTodos(vertice) {
        const verticeIndex = this.vertices.findIndex(v => v.codigo === vertice);
        if (verticeIndex === -1) {
            throw new Error("Vértice no encontrado");
        }
        this.grafo.forEach((_, i) => {
            if (i !== verticeIndex) {
                this.grafo[verticeIndex].push(i);
                this.grafo[i].push(verticeIndex);
            }
        });
    }

    agregarVertice(vertice) {
        this.vertices.push(vertice);
    
        // Inicializar la matriz de adyacencia si aún no se ha hecho
        if (this.grafo.length === 0) {
            this.grafo = new Array(this.vertices.length).fill(null).map(() => new Array(this.vertices.length).fill(Infinity));
        } else {
            // Expandir la matriz de adyacencia si se agrega un nuevo vértice
            this.grafo.forEach(fila => fila.push(Infinity));
            this.grafo.push(new Array(this.vertices.length).fill(Infinity));
        }
    
        // Actualizar las distancias con respecto a los vértices existentes
        for (let i = 0; i < this.vertices.length - 1; i++) {
            const distancia = this.calcularDistanciaHaversine(vertice.Latitude, vertice.Longitude, this.vertices[i].Latitude, this.vertices[i].Longitude);
            this.grafo[i][this.vertices.length - 1] = distancia;
            this.grafo[this.vertices.length - 1][i] = distancia;
        }

       //console.log("Matriz de Adyacencia después de agregar el vértice:");
       // this.grafo.forEach(fila => console.log(fila.join('\t')));
    }
    
    

    // Método para mostrar información sobre los vértices
    imprimirGrafo() {
        this.vertices.forEach((vertice, index) => {
            ///console.log(`Vértice ${vertice.AirportName} (Código: ${vertice.AirportCode}): en ${vertice.City}, ${vertice.Country}. Lat: ${vertice.Latitude}, Long: ${vertice.Longitude}`);
        });
    }

    mostrarAtributosVertice(codigo) {
        const vertice = this.vertices.find(v => v.AirportCode === codigo);
        if (vertice) {
            console.log(`Atributos del vértice ${vertice.AirportName}:`);
            console.log(`Código: ${vertice.AirportCode}`);
            console.log(`Nombre: ${vertice.AirportName}`);
            console.log(`Ciudad: ${vertice.City}`);
            console.log(`País: ${vertice.Country}`);
            console.log(`Latitud: ${vertice.Latitude}`);
            console.log(`Longitud: ${vertice.Longitude}`);
        } else {
            console.log('Vértice no encontrado.');
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
        const distancia = radioTierra * c; // Distancia en kilómetros
        //console.log(`Distancia entre (${lat1},${lon1}) y (${lat2},${lon2}): ${distancia.toFixed(2)} km`);
        
        return distancia; // Distancia en kilómetros
        
   }
    

    dijkstra(inicio) {
        const distancias = new Array(this.vertices.length).fill(Infinity);
        const predecesores = new Array(this.vertices.length).fill(null);
        const visitados = new Array(this.vertices.length).fill(false);
        distancias[inicio] = 0;
    
        for (let i = 0; i < this.vertices.length - 1; i++) {
            let u = -1;
            for (let j = 0; j < this.vertices.length; j++) {
                if (!visitados[j] && (u === -1 || distancias[j] < distancias[u])) {
                    u = j;
                }
            }
            visitados[u] = true;
    
            for (let v = 0; v < this.vertices.length; v++) {
                if (!visitados[v] && this.grafo[u][v] !== Infinity && distancias[u] + this.grafo[u][v] < distancias[v]) {
                    distancias[v] = distancias[u] + this.grafo[u][v];
                    predecesores[v] = u;
                }
            }
        }
       // console.log("Distancias:", distancias); 
        return { distancias, predecesores };
    }
    

    mostrarCaminoMasLargosDesdeVertice(codigo) {
        const inicio = this.vertices.findIndex(v => v.AirportCode === codigo);
        if (inicio === -1) {
            console.log('Vértice no encontrado.');
            return;
        }
    
        const { distancias, predecesores } = this.dijkstra(inicio);
        //console.log(distancias);
        const distanciasConIndices = distancias.map((distancia, indice) => ({ distancia, indice }));
        distanciasConIndices.sort((a, b) => b.distancia - a.distancia);
        //console.log(distanciasConIndices)
    
        const top10 = distanciasConIndices.slice(1, 11);
        //console.log(`Los 10 aeropuertos más lejanos desde ${this.vertices[inicio].AirportName} son:`);
        top10.forEach(item => {
            const vertice = this.vertices[item.indice];
            //console.log(`${vertice.AirportName} en ${vertice.City}, ${vertice.Country}. Distancia: ${item.distancia.toFixed(2)} km`);
        });
    }

    encontrarCamino(codigoInicio, codigoFin) {
        const inicio = this.vertices.findIndex(v => v.AirportCode === codigoInicio);
        const fin = this.vertices.findIndex(v => v.AirportCode === codigoFin);
        
        if (inicio === -1 || fin === -1) {
            console.log("Uno de los vértices no fue encontrado.");
            return;
        }

        const { predecesores } = this.dijkstra(inicio);
        let camino = [];
        for (let v = fin; v !== null; v = predecesores[v]) {
            camino.push(this.vertices[v]);
        }
        camino.reverse();

        camino.forEach(vertice => {
            //console.log(`Código: ${vertice.AirportCode}, Nombre: ${vertice.AirportName}, Ciudad: ${vertice.City}, País: ${vertice.Country}, Latitud: ${vertice.Latitude}, Longitud: ${vertice.Longitude}`);
        });
    }
    
}

function readCSV() {
    const fileInput = document.getElementById('input-file');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecciona un archivo.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const text = event.target.result;
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        const grafo = new Grafo();

        // Asumimos que la primera línea es la cabecera
        lines.slice(1).forEach(line => {
            const [airportCode, airportName, city, country, latitude, longitude] = line.split(',');
            const vertice = {
                AirportCode: airportCode,
                AirportName: airportName,
                City: city,
                Country: country,
                Latitude: parseFloat(latitude),
                Longitude: parseFloat(longitude)
            };
            grafo.agregarVertice(vertice);
        });

        

        grafo.imprimirGrafo();

          //Ejemplo de busqueda del aeropouerto por codigo AAE
        grafo.mostrarAtributosVertice('AAE');
        grafo.mostrarCaminoMasLargosDesdeVertice('AAE');
        grafo.encontrarCamino("AAE", "JFK"); 
        //verificarCalculoDistancias(grafo);
        //verificarVertices(grafo);
       verificarMatrizAdyacencia(grafo);
       // verificarDistanciasDijkstra(grafo, 'AAE');

       
    };

    reader.readAsText(file);
}

function verificarCalculoDistancias(grafo) {
    console.log("Verificando cálculo de distancias:");
    grafo.vertices.forEach((vertice1, index1) => {
        grafo.vertices.forEach((vertice2, index2) => {
            if (index1 !== index2) {
                const distancia = grafo.calcularDistanciaHaversine(vertice1.Latitude, vertice1.Longitude, vertice2.Latitude, vertice2.Longitude);
                console.log(`Distancia entre ${vertice1.AirportName} y ${vertice2.AirportName}: ${distancia.toFixed(2)} km`);
            }
        });
    });
}

function verificarVertices(grafo) {
    console.log("Verificando vertices:");
    console.log(grafo.vertices);
}

function verificarMatrizAdyacencia(grafo) {
    console.log("Verificando matriz de adyacencia:");
    grafo.grafo.forEach(fila => console.log(fila));
}

function verificarDistanciasDijkstra(grafo, codigo) {
    console.log(`Verificando distancias con Dijkstra desde el vértice ${codigo}:`);
    const inicio = grafo.vertices.findIndex(v => v.AirportCode === codigo);
    if (inicio === -1) {
        console.log('Vértice no encontrado.');
        return;
    }
    const { distancias } = grafo.dijkstra(inicio);
    console.log(distancias);
}
