import React from 'react';
import './GameCard.css';

function GameCard({ game }) {
  return (
    <div className="game-card">
      <img src={game.image} alt={game.name} className="card-image" />
      <div className="card-body">
        <h3 className="card-title">{game.name}</h3>
        <p className="card-year">{game.year}</p>
        <div className="card-genres">
          {game.genres.map((genre, i) => (
            <span className="genre-tag" key={i}>{genre}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameCard;
