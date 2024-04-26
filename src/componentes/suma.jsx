import { useState } from 'react';
import { suma } from '../logica/suma';

const Sumador = () => {

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [resultado, setResultado] = useState(0);

  const handleSumar = () => {
    const resultadoSuma = suma(num1, num2);
    setResultado(resultadoSuma);
  };

  return (
    <div>
      <input
        type="number"
        value={num1}
        onChange={(e) => setNum1(parseInt(e.target.value))}
      />
      <input
        type="number"
        value={num2}
        onChange={(e) => setNum2(parseInt(e.target.value))}
      />
      <button onClick={handleSumar}>Sumar</button>
      <p>Resultado: {resultado}</p>
    </div>
  );
};

export default Sumador;
