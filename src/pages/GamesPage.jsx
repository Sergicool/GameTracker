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
    const updatedData = { ...data, games: updatedGames };

    localStorage.setItem('gameTrackerData', JSON.stringify(updatedData));
    setGames(updatedGames);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filterGames = (gameList) => {
    if (!filters) return gameList;

    const {
      selectedGenres = [],
      selectedYears = [],
      selectedOrigins = [],
      selectedSubcategories = [],
    } = filters;

    return gameList.filter((game) => {
      const matchGenre = selectedGenres.length === 0 || selectedGenres.some((genre) => game.genres?.includes(genre));
      const matchYear = selectedYears.length === 0 || selectedYears.includes(String(game.year));
      const matchOrigin = selectedOrigins.length === 0 || selectedOrigins.includes(game.origin);
      const matchSubcategory = selectedSubcategories.length === 0 || selectedSubcategories.includes(game.subcategory);
      return matchGenre && matchYear && matchOrigin && matchSubcategory;
    });
  };

  const groupGames = (games) => {
    const groupBy = filters?.groupBy || 'All Games';

    if (groupBy === 'All Games') {
      return {
        'All Games': [...games].sort((a, b) => a.name.localeCompare(b.name))
      };
    }

    const groups = {};
    for (const game of games) {
      let key = 'Unknown';

      switch (groupBy) {
        case 'Year':
          key = game.year || 'Unknown';
          break;
        case 'Genre':
          // Agrupar por cada género del juego
          game.genres?.forEach((genre) => {
            if (!groups[genre]) groups[genre] = [];
            groups[genre].push(game);
          });
          continue; // evitar que se añada como conjunto único debajo
        case 'Origin':
          key = game.origin || 'Unknown';
          break;
        case 'Category':
          key = game.subcategory || 'Unknown';
          break;
        default:
          key = 'Other';
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(game);
    }

    // Ordenar alfabéticamente las claves
    const sortedKeys = Object.keys(groups).sort((a, b) => a.localeCompare(b));

    const sortedGroups = {};
    for (const key of sortedKeys) {
      // Ordenar internamente los juegos por nombre
      sortedGroups[key] = groups[key].sort((a, b) => a.name.localeCompare(b.name));
    }

    return sortedGroups;
  };

  const filteredGames = filterGames(games);
  const groupedGames = groupGames(filteredGames);

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
        <section className="games-warper">
          {Object.entries(groupedGames).map(([groupName, groupGames]) => (
            groupGames.length > 0 && (
              <div key={groupName} className="group-section">
                <h2 className="group-title">{groupName}</h2>
                <div className="group-grid">
                  {groupGames.map((game) => (
                    <GameCard key={game.name} game={game} onDelete={handleDeleteGame} />
                  ))}
                </div>
              </div>
            )
          ))}
        </section>
      </div>
    </div>
  );
}

export default GamesPage;
