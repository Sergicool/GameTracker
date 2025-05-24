import React from 'react';
import { useDrop } from 'react-dnd';
import GameBox from './GameBox';

function TierRow({ tier, games, onDropGame, onReorderGame }) {
    const [, drop] = useDrop(() => ({
        accept: 'GAME',
        drop: (item, monitor) => {
            if (!monitor.didDrop()) {
                onDropGame(item.game, tier.name);
            }
        },
        hover: (item, monitor) => {
            // Activar hover general si quieres una pista visual cuando no está sobre ningún GameBox
        }
    }));

    return (
        <div className="tier-row" style={{ backgroundColor: tier.color }}>
            <div className="tier-label">{tier.name}</div>
            <div className="tier-games" ref={drop}>
                {games.map((game, index) => (
                    <GameBox
                        key={game.name}
                        game={game}
                        index={index}
                        onReorder={(draggedGame, targetIndex) =>
                            onReorderGame(draggedGame, tier.name, targetIndex)
                        }
                    />
                ))}
            </div>
        </div>
    );
}

export default TierRow;
