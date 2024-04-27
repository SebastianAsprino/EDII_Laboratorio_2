class Grafo {
    constructor() {
        this.vertices = [];
        this.grafo = [];
    }

    agregarVertice(vertice) {
        this.vertices.push(vertice);
        this.grafo.push([]);
    }

    // Método para mostrar información sobre los vértices
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
    };

    reader.readAsText(file);
}
