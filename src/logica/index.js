class Grafo {
    constructor() {
        this.vertices = [];
        this.grafo = [];
    }

    agregarVertice(vertice) {
        this.vertices.push(vertice);
        // Inicializar las nuevas filas en la matriz de adyacencia
        this.grafo.forEach(row => row.push(Infinity));
        this.grafo.push(new Array(this.vertices.length).fill(Infinity).map((_, i) => i === this.vertices.length - 1 ? 0 : Infinity));
    }

    //Mostrar información sobre los vértices
    imprimirGrafo() {
        this.vertices.forEach((vertice, index) => {
            console.log(`Vértice ${vertice.AirportName} (Código: ${vertice.AirportCode}): en ${vertice.City}, ${vertice.Country}. Lat: ${vertice.Latitude}, Long: ${vertice.Longitude}`);
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

    calcularDistancias() {
        const rad = Math.PI / 180;
        const radioTierra = 6371; // Radio de la Tierra en kilómetros

        for (let i = 0; i < this.vertices.length; i++) {
            for (let j = i + 1; j < this.vertices.length; j++) {
                const lat1 = this.vertices[i].Latitude;
                const lon1 = this.vertices[i].Longitude;
                const lat2 = this.vertices[j].Latitude;
                const lon2 = this.vertices[j].Longitude;
                
                const deltaLat = (lat2 - lat1) * rad;
                const deltaLon = (lon2 - lon1) * rad;

                const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                          Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
                          Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distancia = radioTierra * c;

                this.grafo[i][j] = distancia;
                this.grafo[j][i] = distancia; // El grafo es no dirigido
            }
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
        return radioTierra * c; // Distancia en kilómetros
    }
    

    dijkstra(inicio) {
        const distancias = new Array(this.vertices.length).fill(Infinity);
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
                if (!visitados[v] && this.grafo[u][v] && distancias[u] !== Infinity && distancias[u] + this.grafo[u][v] < distancias[v]) {
                    distancias[v] = distancias[u] + this.grafo[u][v];
                }
            }
        }
        return distancias;
    }



    mostrarCaminoMasLargosDesdeVertice(codigo) {
        const inicio = this.vertices.findIndex(v => v.AirportCode === codigo);
        if (inicio === -1) {
            console.log('Vértice no encontrado.');
            return;
        }

        const distancias = this.dijkstra(inicio);
        const distanciasConIndices = distancias.map((distancia, indice) => ({ distancia, indice }));
        distanciasConIndices.sort((a, b) => b.distancia - a.distancia);

        // Tomamos los 10 caminos más largos, excluyendo el propio vértice (distancia 0)
        const top10 = distanciasConIndices.slice(1, 11);

        console.log(`Los 10 aeropuertos más lejanos desde ${this.vertices[inicio].AirportName} son:`);
        top10.forEach(item => {
            const vertice = this.vertices[item.indice];
            console.log(`${vertice.AirportName} en ${vertice.City}, ${vertice.Country}. Distancia: ${item.distancia.toFixed(2)} km`);
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

       
    };

    reader.readAsText(file);
}
