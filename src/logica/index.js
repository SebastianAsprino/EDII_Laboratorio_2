// Leer el archivo CSV 
function readCSV() {
    var fileInput = document.getElementById('input-file');
    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
        var csvData = event.target.result;
        var airportData = processCSV(csvData);
        
        // Ejemplo 
        var codigo = 'COK'; // Probando un codigo
        var aeropuerto = findAirportByCode(airportData, codigo);
        
        if (aeropuerto) {
            console.log("Aeropuerto encontrado con el código " + codigo + ":");
            console.log("Nombre: " + aeropuerto.aeropuerto);
            console.log("Ciudad: " + aeropuerto.ciudad);
            console.log("País: " + aeropuerto.pais);
            console.log("Latitud: " + aeropuerto.latitud);
            console.log("Longitud: " + aeropuerto.longitud);
        } else {
            console.log("No se encontró ningún aeropuerto asociado al código " + codigo);
        }
    };

    reader.readAsText(file);
}

// Procesar el archivo CSV y
// devolver un objeto donde las claves son los códigos de aeropuertos y 
//los valores son los nombres de los aeropuertos
function processCSV(csvData) {
    var lines = csvData.split('\n');
    var airportData = {};

    lines.forEach(function(line) {
        if (line.trim() !== '') {
            var parts = line.split(',');
            var codigo = parts[0];
            var aeropuerto = parts[1];
            var ciudad = parts[2];
            var pais = parts[3];
            var latitud = parts[4];
            var longitud = parts[5];
            
            // Almacena un objeto con todas las propiedades
            airportData[codigo] = {
                aeropuerto: aeropuerto,
                ciudad: ciudad,
                pais: pais,
                latitud: latitud,
                longitud: longitud
            };
        }
    });

    return airportData;
}


// Buscar el aeropuerto asociado a un código dado
function findAirportByCode(airportData, codigo) {
    return airportData[codigo];
}
