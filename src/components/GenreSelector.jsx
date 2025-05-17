import React from 'react';
import './GenreSelector.css';

function GenreSelector({ genreList, selectedGenres, onToggle }) {
  return (
    <div className="genre-box">
      <h4>Genres</h4>
      <div className="genre-list">
        {genreList.map((g, i) => {
          const isSelected = selectedGenres.includes(g.genre);
          return (
            <div
              key={g.genre}
              className={`genre-pill ${isSelected ? 'selected' : ''}`}
              style={{
                backgroundColor: isSelected ? g.color : '#444',
                border: isSelected ? `2px solid ${g.color}` : '2px solid transparent',
                color: isSelected ? '#fff' : '#ccc',
              }}
              onClick={() => onToggle(g.genre)}
            >
              {g.genre}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GenreSelector;
