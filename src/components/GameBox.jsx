import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './GameBox.css';

function GameBox({ game, index, onReorder }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'GAME',
        item: { game, index },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [, drop] = useDrop(() => ({
        accept: 'GAME',
        hover: (item, monitor) => {
            if (item.game.name !== game.name && item.index !== index) {
                onReorder?.(item.game, index);
                item.index = index; // actualizamos el index arrastrado
            }
        },
    }), [game, index]);

    return (
        <div
            ref={(node) => drag(drop(node))}
            className="game-box"
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'grab',
                width: 128,
                height: 64,
                margin: 4,
                backgroundImage: `url(${game.image})`,
                backgroundSize: 'cover',
                borderRadius: 4,
                border: '3px solid #ccc'
            }}
        />
    );
}

export default GameBox;
