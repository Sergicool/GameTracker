import React, { useEffect, useState } from 'react';
import { getItem } from '../utils/db.js';
import TierRow from '../components/TierRow';
import Sidebar from '../components/Sidebar';
import './TierListPage.css';

function TierListPage() {
    // Estados
    const [tiers, setTiers] = useState([]);
    const [games, setGames] = useState([]);
    const [filters, setFilters] = useState({
        selectedGenres: [],
        selectedYears: [],
        selectedOrigins: [],
        selectedSubcategories: [],
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const stored = await getItem('gameTrackerData');
            if (stored) {
                setTiers([...stored.tiers].sort((a, b) => a.position - b.position));
                setGames(stored.games || []);
            }
        }
        fetchData();
    }, []);

    // Función para filtrar juegos
    const filterGames = (gameList) => {
        return gameList.filter(game => {
            // Si filtro vacío => mostrar todo
            if (!filters) return true;

            const { selectedGenres, selectedYears, selectedOrigins, selectedSubcategories } = filters;

            const genreMatch = selectedGenres.length === 0 || (game.genres?.some(g => selectedGenres.includes(g)));
            const yearMatch = selectedYears.length === 0 || selectedYears.includes(String(game.year));
            const originMatch = selectedOrigins.length === 0 || selectedOrigins.includes(game.origin);
            const subcatMatch = selectedSubcategories.length === 0 || selectedSubcategories.includes(game.subcategory);

            return genreMatch && yearMatch && originMatch && subcatMatch;
        });
    };

    // Organizar juegos por tier y filtrarlos
    const gamesByTier = {};
    tiers.forEach(tier => {
        const gamesInTier = games.filter(g => g.tier === tier.name);
        gamesByTier[tier.name] = filterGames(gamesInTier);
    });

    return (
        <div className="tier-list-page" style={{ display: 'flex' }}>
            <div className="sidebar-container">
                <Sidebar
                    isOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onFilterChange={(newFilters) => setFilters(newFilters)}
                    showGroupBy={false}
                />
            </div>
            <div className="tier-list">
                <h1>Tier List</h1>
                {tiers.map(tier => (
                    <TierRow
                        key={tier.name}
                        tier={tier}
                        games={gamesByTier[tier.name] || []}
                        editable={false}
                    />
                ))}
            </div>
        </div>
    );
}


export default TierListPage;
