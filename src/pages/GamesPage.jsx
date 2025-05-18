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
    const updatedGames = games.filter(game => game.name !== name);
    setGames(updatedGames);
    localStorage.setItem('games', JSON.stringify(updatedGames));
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
