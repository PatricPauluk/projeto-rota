import * as React from 'react';
import HomePage from './pages/HomePage'; // <<< O caminho pode variar dependendo da sua estrutura
import 'leaflet/dist/leaflet.css'; // <<< Mantenha isso AQUI ou em src/main.tsx para ser global
import './App.css'; // Se você tiver um CSS global para App

function App() {
  return (
    <div className="app-container"> {/* Pode ser sua div de layout principal */}
      <HomePage />
    </div>
  );
}

export default App;