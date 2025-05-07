import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ padding: '1rem' }}>
      <h2>Lista de Juegos Registrados</h2>

      {games.length === 0 ? (
        <p>No hay juegos registrados aún.</p>
      ) : (
        <ul>
          {games.map((game, i) => (
            <li key={i}>
              {game.title} ({game.year}) - Género: {game.genre}
            </li>
          ))}
        </ul>
      )}

      <button
        style={{ marginTop: '1rem' }}
        onClick={() => navigate('/GameForm')}
      >
        Añadir Nuevo Juego
      </button>
    </div>
  );
}

export default GamesPage;
