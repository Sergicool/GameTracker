import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';
import './GamesPage.css';

function GamesPage() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('games');
    if (stored) {
      setGames(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="games-page">
      <h2>Lista de Juegos Registrados</h2>

      {games.length === 0 ? (
        <p>No hay juegos registrados aún.</p>
      ) : (
        <div className="games-grid">
          {games.map((game, i) => (
            <GameCard key={i} game={game} />
          ))}
        </div>
      )}

      <button className="add-game-btn" onClick={() => navigate('/GameForm')}>
        Añadir Nuevo Juego
      </button>
    </div>
  );
}

export default GamesPage;
