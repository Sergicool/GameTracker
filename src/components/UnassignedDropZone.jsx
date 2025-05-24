import React from 'react';
import { useDrop } from 'react-dnd';
import GameBox from './GameBox';
import './UnassignedDropZone.css';

function UnassignedDropZone({ games, onUnassign }) {
    const [, drop] = useDrop(() => ({
        accept: 'GAME',
        drop: (item) => onUnassign(item.game),
    }));

    return (
        <div ref={drop} className="unassigned-zone" style={{ minHeight: 80, marginTop: 20 }}>
            <div className="unassigned-games" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {games.map((game, index) => (
                    <GameBox key={game.name} game={game} index={index} />
                ))}
            </div>
        </div>
    );
}

export default UnassignedDropZone;
