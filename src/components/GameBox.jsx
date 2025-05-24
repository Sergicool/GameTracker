import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './GameBox.css';

function GameBox({ game, index, onReorder, readOnly }) {
    if (readOnly) {
        return (
            <div
                className="game-box"
                style={{
                    opacity: 1,
                    cursor: 'default',
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

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'GAME',
        item: { game, index },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [, drop] = useDrop(() => ({
        accept: 'GAME',
        hover: (item) => {
            if (item.game.name !== game.name && item.index !== index) {
                onReorder?.(item.game, index);
                item.index = index;
            }
        },
    }), [game, index]);

    return (
        <div
            ref={(node) => drag(drop(node))}
            className={`game-box${readOnly ? '' : ' editable'}`}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'grab',
                width: 128,
                height: 64,
                margin: 4,
                backgroundImage: `url(${game.image})`,
                backgroundSize: 'cover',
                borderRadius: 4,
                border: '3px solid rgba(236, 236, 236, 0.79)'
            }}
        />
    );
}

export default GameBox;
