import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';
import './GamesPage.css';

function GamesPage() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('gameTrackerData');
    const data = stored ? JSON.parse(stored) : { games: [] };
    if (data) {
      setGames(data.games || []);
    }
  }, []);

  const handleDeleteGame = (name) => {
    const stored = localStorage.getItem('gameTrackerData');
    const data = stored ? JSON.parse(stored) : { games: [] };

    const updatedGames = data.games.filter(game => game.name !== name);

    const updatedData = {
      ...data,
      games: updatedGames,
    };
    localStorage.setItem('gameTrackerData', JSON.stringify(updatedData));

    setGames(updatedGames);
  };

  return (
    <div className="games-container">
      <section className="games-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onDelete={handleDeleteGame} />
        ))}
      </section>
    </div>
  );
}

export default GamesPage;
