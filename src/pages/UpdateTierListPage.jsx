import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TierRow from '../components/TierRow';
import { getItem, setItem } from '../utils/db.js';
import './UpdateTierListPage.css';
import { usePrompt } from '../utils/usePrompt';
import UnassignedDropZone from '../components/UnassignedDropZone';

function UpdateTierListPage() {
    const [tiers, setTiers] = useState([]);
    const [games, setGames] = useState([]);
    const [originalGames, setOriginalGames] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const stored = await getItem('gameTrackerData');
            if (stored) {
                setTiers([...stored.tiers].sort((a, b) => a.position - b.position));
                setGames(stored.games || []);
                setOriginalGames(stored.games || []);
            }
        }
        fetchData();
    }, []);

    const isDirty = JSON.stringify(games) !== JSON.stringify(originalGames);

    usePrompt('You have unsaved changes. Are you sure you want to leave?', isDirty);

    const gamesByTier = {};
    tiers.forEach((tier) => {
        gamesByTier[tier.name] = games
            .filter((g) => g.tier === tier.name)
            .sort((a, b) => (a.tierPosition || 0) - (b.tierPosition || 0));
    });

    const updateTierPositions = (gamesList) => {
        const updated = [...gamesList];
        const byTier = {};

        for (const game of updated) {
            if (!game.tier) continue;
            if (!byTier[game.tier]) byTier[game.tier] = [];
            byTier[game.tier].push(game);
        }

        // Primero ordenamos los tiers
        const sortedTierNames = tiers.map(t => t.name);

        let globalIndex = 1;
        for (const tierName of sortedTierNames) {
            const gamesInTier = (byTier[tierName] || []).sort((a, b) => (a.tierPosition || 0) - (b.tierPosition || 0));
            gamesInTier.forEach((g, i) => {
                g.tierPosition = i + 1;
                g.globalPosition = globalIndex++;
            });
        }

        // Juegos sin tier
        updated
            .filter(g => !g.tier)
            .forEach(g => {
                g.tierPosition = null;
                g.globalPosition = null;
            });

        return updated;
    };

    const handleDropGame = (game, tierName) => {
        setGames((prevGames) => {
            const updated = prevGames.map((g) =>
                g.name === game.name ? { ...g, tier: tierName } : g
            );
            return updateTierPositions(updated);
        });
    };

    const handleReorderGame = (draggedGame, tierName, targetIndex) => {
        setGames((prevGames) => {
            const sameTierGames = prevGames
                .filter(g => g.tier === tierName && g.name !== draggedGame.name)
                .sort((a, b) => (a.tierPosition || 0) - (b.tierPosition || 0));

            sameTierGames.splice(targetIndex, 0, draggedGame);

            const updatedTierGames = sameTierGames.map((g, i) => ({
                ...g,
                tier: tierName,
                tierPosition: i + 1,
            }));

            const rest = prevGames.filter(g => g.tier !== tierName || g.name === draggedGame.name);
            return [...rest.filter(g => g.name !== draggedGame.name), ...updatedTierGames];
        });
    };


    const handleSave = async () => {
        try {
            const updatedGames = updateTierPositions(games);
            const stored = await getItem('gameTrackerData');
            await setItem('gameTrackerData', { ...stored, games: updatedGames });
            setOriginalGames(updatedGames); // ✅ reset
            alert('Tier list saved successfully!');
        } catch (e) {
            alert('Error saving tier list: ' + e.message);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="update-tier-list-page">
                <h1>Edit Tier List</h1>

                <div className="tier-list">
                    {tiers.map((tier) => (
                        <TierRow
                            key={tier.name}
                            tier={tier}
                            games={gamesByTier[tier.name] || []}
                            onDropGame={handleDropGame}
                            onReorderGame={handleReorderGame}
                            editable={true}
                        />
                    ))}
                </div>

                <UnassignedDropZone
                    games={games.filter((g) => !g.tier)}
                    onUnassign={(game) => {
                        setGames((prev) =>
                            prev.map((g) =>
                                g.name === game.name ? { ...g, tier: null, tierPosition: null } : g
                            )
                        );
                    }}
                />
                <div className='button-container'>
                    <button className='save-button' onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </DndProvider>
    );
}

export default UpdateTierListPage;
