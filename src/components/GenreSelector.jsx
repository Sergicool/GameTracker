import React from 'react';
import './GenreSelector.css';

function GenreSelector({ genreList, selectedGenres, onToggle }) {
  return (
    <div className="genre-box">
      <h4>Genres</h4>
      <div className="genre-list">
        {/* List of genre checkboxes */}
        {genreList.map((g, i) => (
          <label key={i}>
            <input
              type="checkbox"
              checked={selectedGenres.includes(g.genre)}
              onChange={() => onToggle(g.genre)}
            />{' '}
            {g.genre}
          </label>
        ))}
      </div>
    </div>
  );
}

export default GenreSelector;
