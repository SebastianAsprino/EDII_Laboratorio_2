import { useState } from 'react'
import './App.css'
import MapView from './MapView';
import 'leaflet/dist/leaflet.css';


function App() {

  return (
    <>
      <div className="App">
        <MapView />
      </div>
    </>
  )
}

export default App
