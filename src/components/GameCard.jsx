import React, { useEffect, useRef, useState } from 'react';
import { setItem } from '../utils/db';
import './GameCard.css';

function GameCard({ game, onDelete, disableGameCardModal = false, genresWithColors = [] }) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    if (!disableGameCardModal) setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(game.genres.length);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(container.children);
    let initialTop = null;
    let count = 0;

    for (const child of children) {
      const top = child.getBoundingClientRect().top;
      if (initialTop === null) initialTop = top;
      if (top > initialTop) break;
      count++;
    }

    const adjustedCount = count < game.genres.length ? count - 1 : count;
    setVisibleCount(Math.max(0, adjustedCount));
  }, [game.genres]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const visibleGenres = game.genres.slice(0, visibleCount);
  const hiddenCount = game.genres.length - visibleCount;

  const getGenreColor = (genre) => {
    const found = genresWithColors.find(g => g.genre === genre);
    return found?.color || '#444';
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${game.name}"?\nThis action can't be undone.`);
    if (confirmDelete) {
      onDelete(game.name);
      setShowModal(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('game-card-modal-overlay')) {
      closeModal();
    }
  };

  return (
    <>
      <div className={`game-card ${disableGameCardModal ? 'no-hover' : ''}`} onClick={openModal}>
        <div className="card-head">
          <img src={game.image} className="card-image" />
        </div>
        <div className="card-body">
          <h3 className="card-title">{game.name}</h3>
          <p className="card-year">{game.year}</p>
          <div className="card-genres" ref={containerRef}>
            {visibleGenres.map((genre, i) => (
              <span
                key={i}
                className="genre-tag"
                style={{ backgroundColor: getGenreColor(genre) }}
              >
                {genre}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="genre-tag genre-tag-more">
                +{hiddenCount} more
              </span>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="game-card-modal-overlay" onClick={handleOutsideClick}>
          <div className="game-card-modal-content">
            <div className="game-card-modal-head">
              <img src={game.image} alt={game.name} className="game-card-modal-image" />
            </div>
            <div className="game-card-modal-body">
              <div className="game-card-modal-title">
                {game.name}
              </div>
              <hr className="game-card-modal-divider" />

              <div className="game-card-modal-year">
                Played in
                <div className="game-card-modal-year-value">{game.year}</div>
              </div>
              
              <div className="game-card-modal-origin">
                Classification
                <div className="game-card-modal-origin-value">{game.origin}</div>
              </div>
              
              <div className="game-card-modal-category">
                Category
                <div className="game-card-modal-category-value">{game.category} - {game.subcategory}</div>
              </div>
              {game.globalPosition != null && (
                <div className="game-card-tier-position">
                  Position 
                  <div className="game-card-modal-position-value">{game.globalPosition}</div>
                </div>
              )}
              <div className="game-card-modal-genres-wrapper">
                Genres
                <div className="game-card-modal-genres">
                  {game.genres.map((genre, i) => (
                    <span
                      key={i}
                      className="game-card-modal-genre-tag"
                      style={{ backgroundColor: getGenreColor(genre) }}
                    >
                      {genre} 
                    </span>
                  ))}
                </div>
              </div>

              <div className="game-card-modal-buttons">
                <button
                  className="edit-button"
                  onClick={async () => {
                    await setItem('editGame', game);
                    window.location.href = '/GameForm';
                  }}
                >
                  Edit
                </button>
                <button className="delete-button" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GameCard;
