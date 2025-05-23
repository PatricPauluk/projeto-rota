import * as React from 'react';
import HomePage from './pages/HomePage';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  return (
    <div className="app-container"> {/* Pode ser sua div de layout principal */}
      <HomePage />
    </div>
  );
}

export default App;