import { useState } from 'react'

import './App.css'
import MapView from './MapView';
// import Test from "./test"




import 'leaflet/dist/leaflet.css';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <Test/> */}

      <div className="App">
        <MapView /> 
    </div>
    </>
  )
}

export default App
