import React from 'react';
import { useDrop } from 'react-dnd';
import GameBox from './GameBox';
import './TierRow.css';

function TierRow({ tier, games, onDropGame, onReorderGame, editable = true }) {
    const [, drop] = editable ? useDrop(() => ({
        accept: 'GAME',
        drop: (item, monitor) => {
            if (!monitor.didDrop() && onDropGame) {
                onDropGame(item.game, tier.name);
            }
        },
    }), [editable]) : [{}, null];

    return (
        <div className="tier-row" style={{ backgroundColor: tier.color }}>
            <div className="tier-label">{tier.name}</div>
            <div className="tier-games" ref={editable ? drop : null}>
                {games.map((game, index) => (
                    <GameBox
                        key={game.name}
                        game={game}
                        index={index}
                        onReorder={
                            editable && onReorderGame
                                ? (draggedGame, targetIndex) =>
                                      onReorderGame(draggedGame, tier.name, targetIndex)
                                : null
                        }
                        readOnly={!editable}
                    />
                ))}
            </div>
        </div>
    );
}

export default TierRow;
