import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import TierListPage from './pages/TierListPage';
import GamesPage from './pages/GamesPage';
import GameFormPage from './pages/GameFormPage';
import HallOfFamePage from './pages/HallOfFamePage';
import UpdateDataPage from './pages/UpdateDataPage';
import './App.css';

// Muestra la cabecera
// Carga el componente de la pagina dependiendo de la ruta actual
function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/Games" replace />} />
        <Route path="/TierList" element={<TierListPage />} />
        <Route path="/Games" element={<GamesPage />} />
        <Route path="/GameForm" element={<GameFormPage />} />
        <Route path="/HallOfFame" element={<HallOfFamePage />} />
        <Route path="/UpdateData" element={<UpdateDataPage />} />
      </Routes>
    </div>
  );
}

export default App;
