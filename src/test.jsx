// CSVReaderComponent.jsx
import React, { useState } from 'react';
import { readCSV } from './logica/grafo'; // Asegúrate de que la ruta es correcta

function Test() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleProcessFile = () => {
        if (file) {
            readCSV(file);
        } else {
            console.log('Please select a file to process.');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept=".csv" />
            <button onClick={handleProcessFile}>Process CSV</button>
        </div>
    );
}

export default Test;
