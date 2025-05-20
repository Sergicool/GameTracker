import React, { useEffect, useRef, useState } from 'react';
import './GameCard.css';
import getGenreColor from '../utils/getGenreColor';
import ModalBase from './ModalBase';

function GameCard({ game, onDelete, disableGameCardModal = false }) {
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

  const visibleGenres = game.genres.slice(0, visibleCount);
  const hiddenCount = game.genres.length - visibleCount;

  const handleDelete = () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${game.name}"?\nThis action can't be undone.`);
    if (confirmDelete) {
      onDelete(game.name);
      setShowModal(false);
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

      <ModalBase isOpen={showModal} onClose={closeModal}>
        <img src={game.image} alt={game.name} className="modal-image" />
        <h2 className="modal-title">{game.name}</h2>

        <div className="modal-year">
          Played in
          <div className="modal-year-value">{game.year}</div>
        </div>

        <div className="modal-origin">
          Classification
          <div className="modal-origin-value">{game.origin}</div>
        </div>

        <div className="modal-category">
          Category
          <div className="modal-category-value">{game.category} - {game.subcategory}</div>
        </div>

        <div className="modal-genres-wrapper">
          Genres
          <div className="modal-genres">
            {game.genres.map((genre, i) => (
              <span
                key={i}
                className="modal-genre-tag"
                style={{ backgroundColor: getGenreColor(genre) }}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div className="modal-buttons">
          <button className="edit-button"
            onClick={() => {
              localStorage.setItem('editGame', JSON.stringify(game));
              window.location.href = '/GameForm';
            }}
          >
            Editar
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Eliminar
          </button>
        </div>
      </ModalBase>
    </>
  );
}

export default GameCard;
