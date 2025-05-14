import React from 'react';
import GameCard from './GameCard';
import './GamePreview.css';

function GamePreview({
  name,
  imagePreview,
  yearPlayed,
  selectedGenres,
  category,
  subcategory,
  origin,
}) {
  return (
    <div className="preview">
      <h3>Preview</h3>

      {/* Show preview only if the name is filled */}
      {name && (
        <GameCard
          game={{
            name,
            image: imagePreview,
            year: yearPlayed,
            genres: selectedGenres,
            category,
            subcategory,
            origin,
          }}
          disableGameCardModal={true}
        />
      )}
    </div>
  );
}

export default GamePreview;
