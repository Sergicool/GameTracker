import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';
import Sidebar from '../components/Sidebar';
import './GamesPage.css';

function GamesPage() {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('gameTrackerData');
    const data = stored ? JSON.parse(stored) : { games: [] };
    setGames(data.games || []);
  }, []);

  const handleDeleteGame = (name) => {
    const stored = localStorage.getItem('gameTrackerData');
    if (!stored) return;

    const data = JSON.parse(stored);
    const updatedGames = data.games.filter((game) => game.name !== name);

    // Actualiza solo los juegos, mantiene el resto de los datos (years, genres, etc.)
    const updatedData = {
      ...data,
      games: updatedGames,
    };

    localStorage.setItem('gameTrackerData', JSON.stringify(updatedData));
    setGames(updatedGames); // También actualiza el estado local
  };


  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filterGames = (gameList) => {
    if (!filters) return gameList;

    const {
      selectedGenres,
      selectedYears,
      selectedOrigins,
      selectedSubcategories,
    } = filters;

    console.log('selectedYears:', selectedYears);
    console.log('game.year:', gameList.map(g => g.year));

    return gameList.filter((game) => {
      const matchGenre =
        selectedGenres.length === 0 ||
        selectedGenres.some((genre) => game.genres?.includes(genre));

      const matchYear =
        selectedYears.length === 0 || selectedYears.includes(String(game.year));

      const matchOrigin =
        selectedOrigins.length === 0 || selectedOrigins.includes(game.origin);

      const matchSubcategory =
        selectedSubcategories.length === 0 ||
        selectedSubcategories.includes(game.subcategory);

      return matchGenre && matchYear && matchOrigin && matchSubcategory;
    });
  };

  const filteredGames = filterGames(games);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="page-wrapper">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onFilterChange={handleFilterChange}
      />
      <div className={`games-container ${isSidebarOpen ? 'shifted' : ''}`}>
        <section className="games-grid">
          {filteredGames.map((game) => (
            <GameCard key={game.name} game={game} onDelete={handleDeleteGame} />
          ))}
        </section>
      </div>
    </div>
  );
}


export default GamesPage;
