import React from 'react';
import { useDrop } from 'react-dnd';

function DropBin({ onDrop }) {
    const [, drop] = useDrop(() => ({
        accept: 'GAME',
        drop: onDrop,
    }));

    return (
        <div ref={drop} className="drop-bin">
            Arrastra aquí para quitar de tier
        </div>
    );
}

export default DropBin;
